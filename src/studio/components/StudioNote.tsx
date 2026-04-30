import { InfoOutlineIcon } from '@sanity/icons';
import { Card, Stack, Text } from '@sanity/ui';

type Props = {
  title: string;
  description: string;
};

export default function StudioNote({ title, description }: Props) {
  return (
    <Card padding={3} radius={2} tone="primary">
      <Stack space={2}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <InfoOutlineIcon />
          <Text size={1} weight="bold">
            {title}
          </Text>
        </div>
        <Text size={1} muted>
          {description}
        </Text>
      </Stack>
    </Card>
  );
}
