import { DynamicStringSelect } from '@spraxium/components';
import type { SelectRenderConfig } from '@spraxium/components';
import type { Topic } from '../topics.data';

export interface FilterSelectData {
  topics: ReadonlyArray<Topic>;
  audience: 'beginner' | 'pro';
}

@DynamicStringSelect({
  baseId: 'topic-filter',
  placeholder: 'Filter by topic',
  encoding: 'inline',
})
export class FilterSelect {
  static render(data: FilterSelectData): SelectRenderConfig {
    return {
      options: data.topics.map((t) => ({
        label: t.name,
        value: t.slug,
        description: t.description,
      })),
      params: { audience: data.audience },
    };
  }
}
