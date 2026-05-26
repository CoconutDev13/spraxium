import 'reflect-metadata';
import { COMPONENT_METADATA_KEYS } from '../component-metadata-keys.constant';

/**
 * Parameter decorator that injects the resolved payload bound to a modal
 * built with `ModalService.buildWithPayload()`.
 *
 * The payload is persisted in the `PayloadService` store and referenced via
 * `~p:<id>` in the custom ID. Use this when the data is too large for inline
 * encoding or when you need type-safe structured objects.
 *
 * @example
 * ```ts
 * interface TicketPayload { category: string; userId: string; metadata: object }
 *
 * @ModalHandler(TicketFormModal)
 * export class TicketFormModalHandler {
 *   async handle(
 *     @ModalPayload() payload: TicketPayload,
 *     @Field('description') description: string,
 *     @Ctx() ctx: ModalContext,
 *   ) {
 *     await db.tickets.create({ ...payload, form: { description } });
 *   }
 * }
 * ```
 */
export function ModalPayload(): ParameterDecorator {
  return (target: object, propertyKey: string | symbol | undefined, parameterIndex: number): void => {
    const key = propertyKey ?? 'handle';
    const existing = Reflect.getMetadata(COMPONENT_METADATA_KEYS.MODAL_PAYLOAD_PARAM, target, key);
    if (existing !== undefined) {
      throw new Error('@ModalPayload() can only be used once per handler method.');
    }
    Reflect.defineMetadata(COMPONENT_METADATA_KEYS.MODAL_PAYLOAD_PARAM, parameterIndex, target, key);
  };
}
