import { Gutter, Button } from '@payloadcms/ui';
import { type AdminViewProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates';
import Chart from './Chart';
import Link from 'next/link'
import { type PayloadRequest } from 'payload';

type TimeRange = 'day' | 'week' | 'month';
type AnalyticsData = {
  period: string;
  count: number;
};

const filters: TimeRange[] = ['day', 'week', 'month']

async function getUserAnalytics(
  req: PayloadRequest,
  filter: TimeRange = 'day'
): Promise<AnalyticsData[]> {
  const now = new Date();
  const startDate = new Date();
  
  switch (filter) {
    case 'day':
      startDate.setDate(now.getDate() - 31);
      break;
    case 'week':
      startDate.setDate(now.getDate() - (7 * 26));
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 12);
      break;
  }

  const users = await req.payload.find({
    collection: 'users',
    where: {
      created_at: {
        greater_than: startDate.toISOString(),
      },
    },
    depth: 0,
  });

  const dateMap = new Map<string, number>();
  const currentDate = new Date(startDate);

  while (currentDate <= now) {
    let period: string;

    switch (filter) {
      case 'day':
        period = currentDate.toISOString().split('T')[0];
        break;
      case 'week': {
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        period = weekStart.toISOString().split('T')[0];
        break;
      }
      case 'month':
        period = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        break;
    }

    dateMap.set(period, 0);
    
    switch (filter) {
      case 'day':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'week':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'month':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
  }

  users.docs.forEach(user => {
    const date = new Date(user.created_at);
    let period: string;

    switch (filter) {
      case 'day':
        period = date.toISOString().split('T')[0];
        break;
      case 'week': {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        period = weekStart.toISOString().split('T')[0];
        break;
      }
      case 'month':
        period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
    }

    if (dateMap.has(period)) {
      dateMap.set(period, (dateMap.get(period) || 0) + 1);
    }
  });

  return Array.from(dateMap.entries())
    .map(([period, count]) => ({ period, count }))
    .sort((a, b) => a.period.localeCompare(b.period));
  
}

const Analytics: React.FC<AdminViewProps> = async ({
  initPageResult,
  params,
  searchParams,
}) =>  {

  const filter: TimeRange = 
  typeof searchParams.filter === 'string' && filters.includes(searchParams.filter as TimeRange) 
    ? (searchParams.filter as TimeRange) 
    : filters[0]

  const total = await initPageResult.req.payload.count({ collection: 'users' })
  const users = await getUserAnalytics(initPageResult.req, filter)

  return <DefaultTemplate  i18n={initPageResult.req.i18n}
    locale={initPageResult.locale}
    params={params}
    payload={initPageResult.req.payload}
    permissions={initPageResult.permissions}
    searchParams={searchParams}
    user={initPageResult.req.user || undefined}
    visibleEntities={initPageResult.visibleEntities}
  >
    <Gutter>
      <Link href="/admin">
        <Button>Домой</Button>
      </Link>
      <Chart total={total.totalDocs} users={users} filters={filters} />
    </Gutter>
  </DefaultTemplate>
}

export default Analytics