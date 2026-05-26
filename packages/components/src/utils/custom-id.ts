/**
 * Re-exports the custom-ID codec from the shared utils layer.
 * Import from here instead of `runtime/dispatcher/helpers/split-custom-id.helper`
 * to avoid coupling service-layer code to the runtime internals.
 */
export {
  splitCustomId,
  joinCustomId,
  encodeInlineParams,
  decodeInlineParams,
  type InlineParams,
  type InlineParamValue,
} from '../runtime/dispatcher/helpers/split-custom-id.helper';
