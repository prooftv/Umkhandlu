import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client/client';

const lineageQuery = `*[_type == "notice" && defined(slug.current)] | order(date desc) {
  _id,
  title,
  "slug": slug.current,
  noticeType,
  date,
  "relatedArea": relatedArea->{ name, "slug": slug.current },
  "producedRecords": *[_type == "record" && originNotice._ref == ^._id] | order(date asc) {
    _id,
    title,
    "slug": slug.current,
    recordType,
    date,
    status,
    summary,
    verificationNote,
    evidence[]{ title, "url": asset->url },
    "relatedArea": relatedArea->{ name, "slug": slug.current },
    "childRecords": *[_type == "record" && parentRecord._ref == ^._id] | order(date asc) {
      _id,
      title,
      "slug": slug.current,
      recordType,
      date,
      status,
      summary,
      verificationNote,
      evidence[]{ title, "url": asset->url },
      "childRecords": *[_type == "record" && parentRecord._ref == ^._id] | order(date asc) {
        _id,
        title,
        "slug": slug.current,
        recordType,
        date,
        status,
        summary,
        verificationNote,
        evidence[]{ title, "url": asset->url },
        "childRecords": *[_type == "record" && parentRecord._ref == ^._id] | order(date asc) {
          _id,
          title,
          "slug": slug.current,
          recordType,
          date,
          status,
          summary
        }
      }
    }
  }
}`;

const filteredLineageQuery = `*[_type == "notice" && defined(slug.current) && references(*[_type == "listing" && slug.current == $area]._id)] | order(date desc) {
  _id,
  title,
  "slug": slug.current,
  noticeType,
  date,
  "relatedArea": relatedArea->{ name, "slug": slug.current },
  "producedRecords": *[_type == "record" && originNotice._ref == ^._id] | order(date asc) {
    _id,
    title,
    "slug": slug.current,
    recordType,
    date,
    status,
    summary,
    verificationNote,
    evidence[]{ title, "url": asset->url },
    "childRecords": *[_type == "record" && parentRecord._ref == ^._id] | order(date asc) {
      _id,
      title,
      "slug": slug.current,
      recordType,
      date,
      status,
      summary,
      verificationNote,
      evidence[]{ title, "url": asset->url },
      "childRecords": *[_type == "record" && parentRecord._ref == ^._id] | order(date asc) {
        _id,
        title,
        "slug": slug.current,
        recordType,
        date,
        status,
        summary
      }
    }
  }
}`;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const area = request.nextUrl.searchParams.get('area');

  if (!token || token !== process.env.SANITY_API_READ_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = area
    ? await client.fetch(filteredLineageQuery, { area })
    : await client.fetch(lineageQuery);

  const withLineage = data.filter(
    (notice: { producedRecords?: unknown[] }) =>
      notice.producedRecords && notice.producedRecords.length > 0
  );

  return NextResponse.json({
    exported: new Date().toISOString(),
    total: withLineage.length,
    lineage: withLineage,
  });
}
