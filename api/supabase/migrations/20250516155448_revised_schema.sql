alter table "public"."showcase_sections" add column "order" smallint not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_showcase_with_details_and_bold()
 RETURNS SETOF jsonb
 LANGUAGE sql
 STABLE
AS $function$
	select
		public.strip_nulls_recursively(
			jsonb_build_object(
				'id', 		ss.id::text,
				'anchor',	a.anchor,
				'title',	ss.title,
				'order',	ss.order,
				'content',	(
					select jsonb_agg(
						jsonb_build_object(
							'id',			ds.id::text,
							'tag',			t.tag,
							'wrapped',		ds.wrapped,
							'name',			ds.name,
							'content',		ds.content,
							'endpoint',	ds.url_content,
							'boldContent',	(
								select jsonb_agg(
									jsonb_build_object(
										'id',		bds.id::text,
										'tag',		bt.tag,
										'content',	bds.content
									)
								)
								from public.bold_detail_sections bds
								left join public.ref_tag bt on bds.tag_id = bt.id
								where bds.detail_section_id = ds.id
							)
						)
					) filter (where ds.id is not null)
				)
			)
		) as _
	from public.showcase_sections ss
	left join public.detail_sections ds on ss.id = ds.showcase_section_id
	left join public.ref_tag t on ds.tag_id = t.id
	left join public.ref_anchor a on ss.anchor_id = a.id
	group by ss.id, a.anchor
$function$
;



