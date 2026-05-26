import 'reflect-metadata';
import { COMPONENT_METADATA_KEYS } from '../component-metadata-keys.constant';

/**
 * Parameter decorator that injects URL-decoded inline params from a modal
 * built with `ModalService.buildWithParams()`.
 *
 * The params are encoded into the modal's custom ID (`~k=v&...`) at build time
 * and decoded back at submission time.
 *
 * @example
 * ```ts
 * interface TicketParams { category: string }
 *
 * @ModalHandler(TicketFormModal)
 * export class TicketFormModalHandler {
 *   async handle(
 *     @ModalParams() { category }: TicketParams,
 *     @Field('description') description: string,
 *     @Ctx() ctx: ModalContext,
 *   ) {
 *     await db.tickets.create({ category, form: { description } });
 *   }
 * }
 * ```
 */
export function ModalParams(): ParameterDecorator {
  return (target: object, propertyKey: string | symbol | undefined, parameterIndex: number): void => {
    const key = propertyKey ?? 'handle';
    const existing = Reflect.getMetadata(COMPONENT_METADATA_KEYS.MODAL_PARAMS_PARAM, target, key);
    if (existing !== undefined) {
      throw new Error('@ModalParams() can only be used once per handler method.');
    }
    Reflect.defineMetadata(COMPONENT_METADATA_KEYS.MODAL_PARAMS_PARAM, parameterIndex, target, key);
  };
}
