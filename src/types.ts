import { ConversationFlavor } from '@grammyjs/conversations'
import { HydrateFlavor } from '@grammyjs/hydrate'
import { Context } from 'grammy'

export type CommandCtx = HydrateFlavor<Context>

export type ConversationCtx = ConversationFlavor<Context>