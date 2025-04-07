import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';
import OpenAI from 'openai';
import { LeaveService } from 'src/leave/leave.service';
import { DocumentService } from 'src/document/document.service';

@Injectable()
export class ChatService {
  private openai: OpenAI;
  private assistantId: string;
  private readonly logger = new Logger(ChatService.name);

  constructor(private prisma: PrismaService, private leaveService: LeaveService,private documentService: DocumentService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.assistantId = process.env.OPENAI_ASSISTANT_ID;
  }

  async handleMessage(userMessage: string, userId: string) {
    const now = new Date();
    const threadExpiration = 15 * 60 * 1000; // 15 minutes

    let chatThread = await this.prisma.chatThread.findUnique({ where: { userId } });

    // Check if a thread exists and is active
    if(chatThread) {
      if(new Date(now.getTime() - threadExpiration) > chatThread.lastUsedAt){
        // Mark old thread as inactive
        await this.prisma.chatThread.update({
          where: { userId },
          data: {
            isActive: false,
            lastUsedAt: new Date(),
          },
        });
      } else {
        try {
          await this.openai.beta.threads.retrieve(chatThread.threadId);
          await this.prisma.chatThread.update({
            where: { userId },
            data: {
              lastUsedAt: new Date(),
            },
          });
        } catch (error) {
          if (
            error instanceof OpenAI.APIError &&
            error.status === 404
          ) {
            this.logger.warn(`Stale thread detected for user ${userId}, cleaning up...`);
      
            // delete thread from DB
            await this.prisma.chatThread.delete({ where: { userId } });
            chatThread = null; // reset chatThread to null
          } else {
            throw error; // unexpected error, propagate
          }
        }
        // Update last used time
      }
    }

    if (
      !chatThread ||
      !chatThread.isActive) {
      // Create a new OpenAI thread
      const newThread = await this.openai.beta.threads.create();

      // Save to DB
      chatThread = await this.prisma.chatThread.upsert({
        where: { userId },
        update: {
          threadId: newThread.id,
          isActive: true,
        },
        create: {
          userId,
          threadId: newThread.id,
        },
      });
    }

    // Add user message
    await this.openai.beta.threads.messages.create(chatThread.threadId, {
      role: 'user',
      content: userMessage,
    });

    // Run assistant
    const run = await this.openai.beta.threads.runs.create(chatThread.threadId, {
      assistant_id: this.assistantId,
      response_format: { type: "json_object" }
    });

    // Wait for run to complete
    let runStatus;
    do {
      runStatus = await this.openai.beta.threads.runs.retrieve(chatThread.threadId, run.id);
      await new Promise(res => setTimeout(res, 1000));
    } while (['queued', 'in_progress'].includes(runStatus.status));

    // Check for function call
    const steps = await this.openai.beta.threads.runs.steps.list(chatThread.threadId, run.id);
    const step = steps.data?.[0];

    if (
        step?.step_details?.type === 'tool_calls' &&
        'tool_calls' in step.step_details
      ) {
        const toolCall = step.step_details.tool_calls[0];
      
        if (toolCall.type === 'function') {
            const toolCallId = toolCall.id; 
          const { name, arguments: argsString } = toolCall.function;
          const args = JSON.parse(argsString);
          let mockResult = '';
          let toolResult = '';
          let result;
          switch (name) {
            case 'request_leave':
              // Call the leave service to handle the request
              const leaveRequest = {
                type: args.leaveType,
                fromDate: args.fromDate,
                toDate: args.toDate,
                reason: args.reason,
              };
              result = await this.leaveService.create(leaveRequest,userId);
              toolResult = JSON.stringify(result, null, 2);
              break;
            case 'leave_balance':
              // Call the leave service to check the leave balance
              const balance = await this.leaveService.getBalance(userId);
              toolResult = JSON.stringify(balance, null, 2);
              break;
            case 'request_document':
              // Handle document request
              const documentRequest = {
                type: args.documentType,
                reason: args.reason,
              };
              result = await this.documentService.create(documentRequest, userId);
              toolResult = JSON.stringify(result, null, 2);
              break;
            case 'end_chat':
              // End chat
              await this.openai.beta.threads.del(chatThread.threadId);
              toolResult = "{success:true}";
              await this.prisma.chatThread.update({
                where: { userId },
                data: {
                  isActive: false,
                  lastUsedAt: new Date(),
                },
              });
              return 'Your chat session has ended. Come back anytime if you need help again!';
            default:
              toolResult = `Unknown function: ${name}`;
              break;

          }


          await this.openai.beta.threads.runs.submitToolOutputs(
            chatThread.threadId,
            run.id,
            {
              tool_outputs: [
                {
                  tool_call_id: toolCallId,
                  output: toolResult,
                },
              ],
            },
          );
      
          // Wait for final assistant response
          let finalRun;
          do {
            finalRun = await this.openai.beta.threads.runs.retrieve(
              chatThread.threadId,
              run.id,
            );
            await new Promise(res => setTimeout(res, 1000));
          } while (['queued', 'in_progress'].includes(finalRun.status));
      
          const messages = await this.openai.beta.threads.messages.list(chatThread.threadId);
          const finalMessage = messages.data.find(msg => msg.role === 'assistant');
      
          return finalMessage?.content?.[0]?.type === 'text'
            ? finalMessage.content[0].text.value
            : 'Task complete.';

        }
      }

    // Get final assistant response
    const messages = await this.openai.beta.threads.messages.list(chatThread.threadId);
    const assistantMsg = messages.data.find(msg => msg.role === 'assistant');

    return assistantMsg?.content?.[0]?.type === 'text'
      ? assistantMsg.content[0].text.value
      : 'Sorry, I couldn’t process that.';
  }
}
