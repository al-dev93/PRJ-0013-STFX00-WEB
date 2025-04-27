create sequence "public"."ref_anchor_id_seq";

create sequence "public"."ref_tag_id_seq";

create sequence "public"."ref_techno_id_seq";

create table "public"."accounts" (
    "id" uuid not null default gen_random_uuid(),
    "service" text not null,
    "icon" text not null,
    "on_page" boolean,
    "address" text,
    "user_id" uuid
);


alter table "public"."accounts" enable row level security;

create table "public"."bold_detail_sections" (
    "id" uuid not null default gen_random_uuid(),
    "tag_id" integer not null,
    "content" text,
    "user_id" uuid,
    "detail_section_id" uuid not null
);


alter table "public"."bold_detail_sections" enable row level security;

create table "public"."contact_form_inputs" (
    "id" text not null,
    "label" text not null,
    "form_input_id" uuid not null,
    "user_id" uuid
);


alter table "public"."contact_form_inputs" enable row level security;

create table "public"."contact_form_modal" (
    "id" text not null,
    "url_form_content" text not null,
    "url_api" text not null,
    "submit_button_name" text not null,
    "title" text not null,
    "subtitle" text,
    "alert_on_submit" text[] not null,
    "user_id" uuid
);


alter table "public"."contact_form_modal" enable row level security;

create table "public"."contact_form_modal_inputs" (
    "contact_form_modal_id" text not null,
    "contact_form_input_id" text not null,
    "user_id" uuid
);


alter table "public"."contact_form_modal_inputs" enable row level security;

create table "public"."contact_form_tooltips" (
    "id" uuid not null default gen_random_uuid(),
    "contact_form_input_id" text not null,
    "line" text not null,
    "line_height" integer,
    "user_id" uuid
);


alter table "public"."contact_form_tooltips" enable row level security;

create table "public"."detail_sections" (
    "id" uuid not null default gen_random_uuid(),
    "tag_id" integer not null,
    "name" text,
    "content" text,
    "url_content" text,
    "wrapped" boolean,
    "user_id" uuid,
    "showcase_section_id" uuid not null
);


alter table "public"."detail_sections" enable row level security;

create table "public"."error_messages" (
    "id" uuid not null default gen_random_uuid(),
    "form_input_id" uuid not null,
    "pattern_mismatch" text,
    "too_long" text,
    "too_short" text,
    "value_missing" text,
    "user_id" uuid
);


alter table "public"."error_messages" enable row level security;

create table "public"."form_inputs" (
    "id" uuid not null default gen_random_uuid(),
    "type" text,
    "placeholder" text,
    "required" boolean,
    "max_length" integer,
    "min_length" integer,
    "pattern" text,
    "tag_id" integer not null,
    "user_id" uuid
);


alter table "public"."form_inputs" enable row level security;

create table "public"."menu_items" (
    "id" uuid not null default gen_random_uuid(),
    "label" text not null,
    "anchor_id" integer,
    "user_id" uuid
);


alter table "public"."menu_items" enable row level security;

create table "public"."project_deliverables" (
    "id" uuid not null default gen_random_uuid(),
    "path" text not null,
    "project_id" text not null,
    "account_id" uuid not null,
    "user_id" uuid
);


alter table "public"."project_deliverables" enable row level security;

create table "public"."project_techno" (
    "project_id" text not null,
    "techno_id" integer not null,
    "user_id" uuid
);


alter table "public"."project_techno" enable row level security;

create table "public"."projects" (
    "id" text not null,
    "title" text not null,
    "description" text not null,
    "picture" text,
    "display" text not null,
    "user_id" uuid
);


alter table "public"."projects" enable row level security;

create table "public"."ref_anchor" (
    "id" integer not null default nextval('ref_anchor_id_seq'::regclass),
    "anchor" text not null
);


create table "public"."ref_tag" (
    "id" integer not null default nextval('ref_tag_id_seq'::regclass),
    "tag" text not null
);


create table "public"."ref_techno" (
    "id" integer not null default nextval('ref_techno_id_seq'::regclass),
    "name" text not null
);


create table "public"."showcase_sections" (
    "id" uuid not null default gen_random_uuid(),
    "anchor_id" integer,
    "user_id" uuid,
    "title" text
);


alter table "public"."showcase_sections" enable row level security;

create table "public"."skills" (
    "id" uuid not null default gen_random_uuid(),
    "skill" text not null,
    "value" integer not null,
    "font" text,
    "font_size" integer,
    "font_style" text,
    "font_weight" integer,
    "user_id" uuid
);


alter table "public"."skills" enable row level security;

alter sequence "public"."ref_anchor_id_seq" owned by "public"."ref_anchor"."id";

alter sequence "public"."ref_tag_id_seq" owned by "public"."ref_tag"."id";

alter sequence "public"."ref_techno_id_seq" owned by "public"."ref_techno"."id";

CREATE UNIQUE INDEX accounts_pkey ON public.accounts USING btree (id);

CREATE UNIQUE INDEX bold_detail_sections_pkey ON public.bold_detail_sections USING btree (id);

CREATE UNIQUE INDEX contact_form_inputs_form_input_id_key ON public.contact_form_inputs USING btree (form_input_id);

CREATE UNIQUE INDEX contact_form_inputs_pkey ON public.contact_form_inputs USING btree (id);

CREATE UNIQUE INDEX contact_form_modal_inputs_pkey ON public.contact_form_modal_inputs USING btree (contact_form_modal_id, contact_form_input_id);

CREATE UNIQUE INDEX contact_form_modal_pkey ON public.contact_form_modal USING btree (id);

CREATE UNIQUE INDEX contact_form_tooltips_pkey ON public.contact_form_tooltips USING btree (id);

CREATE UNIQUE INDEX detail_sections_pkey ON public.detail_sections USING btree (id);

CREATE UNIQUE INDEX error_messages_form_input_id_key ON public.error_messages USING btree (form_input_id);

CREATE UNIQUE INDEX error_messages_pkey ON public.error_messages USING btree (id);

CREATE UNIQUE INDEX form_inputs_pkey ON public.form_inputs USING btree (id);

CREATE UNIQUE INDEX menu_items_pkey ON public.menu_items USING btree (id);

CREATE UNIQUE INDEX project_deliverables_pkey ON public.project_deliverables USING btree (id);

CREATE UNIQUE INDEX project_techno_pkey ON public.project_techno USING btree (project_id, techno_id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

CREATE UNIQUE INDEX ref_anchor_anchor_key ON public.ref_anchor USING btree (anchor);

CREATE UNIQUE INDEX ref_anchor_pkey ON public.ref_anchor USING btree (id);

CREATE UNIQUE INDEX ref_tag_pkey ON public.ref_tag USING btree (id);

CREATE UNIQUE INDEX ref_tag_tag_key ON public.ref_tag USING btree (tag);

CREATE UNIQUE INDEX ref_techno_name_key ON public.ref_techno USING btree (name);

CREATE UNIQUE INDEX ref_techno_pkey ON public.ref_techno USING btree (id);

CREATE UNIQUE INDEX showcase_sections_pkey ON public.showcase_sections USING btree (id);

CREATE UNIQUE INDEX skills_pkey ON public.skills USING btree (id);

CREATE UNIQUE INDEX skills_skill_key ON public.skills USING btree (skill);

alter table "public"."accounts" add constraint "accounts_pkey" PRIMARY KEY using index "accounts_pkey";

alter table "public"."bold_detail_sections" add constraint "bold_detail_sections_pkey" PRIMARY KEY using index "bold_detail_sections_pkey";

alter table "public"."contact_form_inputs" add constraint "contact_form_inputs_pkey" PRIMARY KEY using index "contact_form_inputs_pkey";

alter table "public"."contact_form_modal" add constraint "contact_form_modal_pkey" PRIMARY KEY using index "contact_form_modal_pkey";

alter table "public"."contact_form_modal_inputs" add constraint "contact_form_modal_inputs_pkey" PRIMARY KEY using index "contact_form_modal_inputs_pkey";

alter table "public"."contact_form_tooltips" add constraint "contact_form_tooltips_pkey" PRIMARY KEY using index "contact_form_tooltips_pkey";

alter table "public"."detail_sections" add constraint "detail_sections_pkey" PRIMARY KEY using index "detail_sections_pkey";

alter table "public"."error_messages" add constraint "error_messages_pkey" PRIMARY KEY using index "error_messages_pkey";

alter table "public"."form_inputs" add constraint "form_inputs_pkey" PRIMARY KEY using index "form_inputs_pkey";

alter table "public"."menu_items" add constraint "menu_items_pkey" PRIMARY KEY using index "menu_items_pkey";

alter table "public"."project_deliverables" add constraint "project_deliverables_pkey" PRIMARY KEY using index "project_deliverables_pkey";

alter table "public"."project_techno" add constraint "project_techno_pkey" PRIMARY KEY using index "project_techno_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."ref_anchor" add constraint "ref_anchor_pkey" PRIMARY KEY using index "ref_anchor_pkey";

alter table "public"."ref_tag" add constraint "ref_tag_pkey" PRIMARY KEY using index "ref_tag_pkey";

alter table "public"."ref_techno" add constraint "ref_techno_pkey" PRIMARY KEY using index "ref_techno_pkey";

alter table "public"."showcase_sections" add constraint "showcase_sections_pkey" PRIMARY KEY using index "showcase_sections_pkey";

alter table "public"."skills" add constraint "skills_pkey" PRIMARY KEY using index "skills_pkey";

alter table "public"."bold_detail_sections" add constraint "bold_detail_sections_detail_section_id_fkey" FOREIGN KEY (detail_section_id) REFERENCES detail_sections(id) ON DELETE RESTRICT not valid;

alter table "public"."bold_detail_sections" validate constraint "bold_detail_sections_detail_section_id_fkey";

alter table "public"."bold_detail_sections" add constraint "bold_detail_sections_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES ref_tag(id) ON DELETE RESTRICT not valid;

alter table "public"."bold_detail_sections" validate constraint "bold_detail_sections_tag_id_fkey";

alter table "public"."contact_form_inputs" add constraint "contact_form_inputs_form_input_id_fkey" FOREIGN KEY (form_input_id) REFERENCES form_inputs(id) ON DELETE CASCADE not valid;

alter table "public"."contact_form_inputs" validate constraint "contact_form_inputs_form_input_id_fkey";

alter table "public"."contact_form_inputs" add constraint "contact_form_inputs_form_input_id_key" UNIQUE using index "contact_form_inputs_form_input_id_key";

alter table "public"."contact_form_modal_inputs" add constraint "contact_form_modal_inputs_contact_form_input_id_fkey" FOREIGN KEY (contact_form_input_id) REFERENCES contact_form_inputs(id) ON DELETE CASCADE not valid;

alter table "public"."contact_form_modal_inputs" validate constraint "contact_form_modal_inputs_contact_form_input_id_fkey";

alter table "public"."contact_form_modal_inputs" add constraint "contact_form_modal_inputs_contact_form_modal_id_fkey" FOREIGN KEY (contact_form_modal_id) REFERENCES contact_form_modal(id) ON DELETE CASCADE not valid;

alter table "public"."contact_form_modal_inputs" validate constraint "contact_form_modal_inputs_contact_form_modal_id_fkey";

alter table "public"."contact_form_tooltips" add constraint "contact_form_tooltips_contact_form_input_id_fkey" FOREIGN KEY (contact_form_input_id) REFERENCES contact_form_inputs(id) ON DELETE CASCADE not valid;

alter table "public"."contact_form_tooltips" validate constraint "contact_form_tooltips_contact_form_input_id_fkey";

alter table "public"."detail_sections" add constraint "detail_sections_showcase_section_id_fkey" FOREIGN KEY (showcase_section_id) REFERENCES showcase_sections(id) ON DELETE RESTRICT not valid;

alter table "public"."detail_sections" validate constraint "detail_sections_showcase_section_id_fkey";

alter table "public"."detail_sections" add constraint "detail_sections_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES ref_tag(id) ON DELETE RESTRICT not valid;

alter table "public"."detail_sections" validate constraint "detail_sections_tag_id_fkey";

alter table "public"."error_messages" add constraint "error_messages_form_input_id_fkey" FOREIGN KEY (form_input_id) REFERENCES form_inputs(id) ON DELETE CASCADE not valid;

alter table "public"."error_messages" validate constraint "error_messages_form_input_id_fkey";

alter table "public"."error_messages" add constraint "error_messages_form_input_id_key" UNIQUE using index "error_messages_form_input_id_key";

alter table "public"."form_inputs" add constraint "form_inputs_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES ref_tag(id) ON DELETE RESTRICT not valid;

alter table "public"."form_inputs" validate constraint "form_inputs_tag_id_fkey";

alter table "public"."menu_items" add constraint "menu_items_anchor_id_fkey" FOREIGN KEY (anchor_id) REFERENCES ref_anchor(id) ON DELETE SET NULL not valid;

alter table "public"."menu_items" validate constraint "menu_items_anchor_id_fkey";

alter table "public"."project_deliverables" add constraint "project_deliverables_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT not valid;

alter table "public"."project_deliverables" validate constraint "project_deliverables_account_id_fkey";

alter table "public"."project_deliverables" add constraint "project_deliverables_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE RESTRICT not valid;

alter table "public"."project_deliverables" validate constraint "project_deliverables_project_id_fkey";

alter table "public"."project_techno" add constraint "project_techno_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE RESTRICT not valid;

alter table "public"."project_techno" validate constraint "project_techno_project_id_fkey";

alter table "public"."project_techno" add constraint "project_techno_techno_id_fkey" FOREIGN KEY (techno_id) REFERENCES ref_techno(id) ON DELETE RESTRICT not valid;

alter table "public"."project_techno" validate constraint "project_techno_techno_id_fkey";

alter table "public"."ref_anchor" add constraint "ref_anchor_anchor_key" UNIQUE using index "ref_anchor_anchor_key";

alter table "public"."ref_tag" add constraint "ref_tag_tag_key" UNIQUE using index "ref_tag_tag_key";

alter table "public"."ref_techno" add constraint "ref_techno_name_key" UNIQUE using index "ref_techno_name_key";

alter table "public"."showcase_sections" add constraint "showcase_sections_anchor_id_fkey" FOREIGN KEY (anchor_id) REFERENCES ref_anchor(id) ON DELETE SET NULL not valid;

alter table "public"."showcase_sections" validate constraint "showcase_sections_anchor_id_fkey";

alter table "public"."skills" add constraint "skills_skill_key" UNIQUE using index "skills_skill_key";

set check_function_bodies = off;

create or replace view "public"."accounts_public" as  SELECT jsonb_strip_nulls(jsonb_build_object('id', a.id, 'service', a.service, 'icon', a.icon, 'address', a.address, 'onPage', a.on_page)) AS item
   FROM accounts a;


CREATE OR REPLACE FUNCTION public.fx_create_pol_delete(tablename text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
	BEGIN
		execute format(
			'create policy "Allow authenticated delete" on %I for delete to authenticated using (user_id = auth.uid());',
			tablename
		);
	END;
$function$
;

CREATE OR REPLACE FUNCTION public.fx_create_pol_insert(tablename text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
	BEGIN
		execute format(
			'create policy "Allow authenticated insert" on %I for insert to authenticated with check (user_id = auth.uid());',
			tablename
		);
	END;
$function$
;

CREATE OR REPLACE FUNCTION public.fx_create_pol_read_only(tablename text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
	BEGIN
		execute format(
			'create policy "Read-only public" on %I for select to public using (true);',
			tablename
		);
	END;
$function$
;

CREATE OR REPLACE FUNCTION public.fx_create_pol_update(tablename text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
	BEGIN
			execute format(
			'create policy "Allow authenticated update" on %I for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());',
			tablename
		);
	END;
$function$
;

CREATE OR REPLACE FUNCTION public.fx_enable_rls_for(tablename text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
	BEGIN
		execute format('alter table %I enable row level security', tablename);
	END;
$function$
;

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
				'content',	(
					select jsonb_agg(
						jsonb_build_object(
							'id',			ds.id::text,
							'tag',			t.tag,
							'wrapped',		ds.wrapped,
							'name',			ds.name,
							'content',		ds.content,
							'urlContent',	ds.url_content,
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

create or replace view "public"."menu_items_with_anchor" as  SELECT mi.id,
    mi.label,
    a.anchor
   FROM (menu_items mi
     LEFT JOIN ref_anchor a ON ((mi.anchor_id = a.id)));


create or replace view "public"."skills_with_property" as  SELECT jsonb_strip_nulls(jsonb_build_object('text', s.skill, 'value', s.value, 'font', s.font, 'fontSize', s.font_size, 'fontStyle', s.font_style, 'fontWeight', s.font_weight)) AS item
   FROM skills s;


CREATE OR REPLACE FUNCTION public.strip_nulls_recursively(j jsonb)
 RETURNS jsonb
 LANGUAGE sql
 IMMUTABLE
AS $function$
	select case
		when jsonb_typeof(j) = 'object' then
			(select jsonb_object_agg(key, strip_nulls_recursively(value))
			 from jsonb_each(j)
			 where value is not null and value <> 'null'::jsonb)
		when jsonb_typeof(j) = 'array' then
			(select jsonb_agg(strip_nulls_recursively(elem))
			 from jsonb_array_elements(j) as t(elem)
			 where elem is not null and elem <> 'null'::jsonb)
		else j
	end;
$function$
;

create or replace view "public"."contact_form_full" as  WITH cleaned AS (
         SELECT strip_nulls_recursively(jsonb_build_object('id', cfm.id, 'urlFormContent', cfm.url_form_content, 'urlApi', cfm.url_api, 'submitButtonName', cfm.submit_button_name, 'title', cfm.title, 'subtitle', cfm.subtitle, 'alertOnSubmit', cfm.alert_on_submit, 'dataFormContent', ( SELECT jsonb_agg(jsonb_build_object('id', cfi.id, 'label', cfi.label, 'tooltipContent', ( SELECT jsonb_agg(jsonb_build_object('id', (cft.id)::text, 'line', cft.line, 'lineHeight', cft.line_height)) AS jsonb_agg
                           FROM contact_form_tooltips cft
                          WHERE (cft.contact_form_input_id = cfi.id)), 'formInput', jsonb_build_object('id', (fi.id)::text, 'tag', rt.tag, 'type', fi.type, 'placeholder', fi.placeholder, 'pattern', fi.pattern, 'required', fi.required, 'maxLength', fi.max_length, 'minLength', fi.min_length, 'error', ( SELECT jsonb_build_object('id', (em.id)::text, 'patternMismatch', em.pattern_mismatch, 'tooLong', em.too_long, 'tooShort', em.too_short, 'valueMissing', em.value_missing) AS jsonb_build_object
                           FROM error_messages em
                          WHERE (em.form_input_id = fi.id))))) AS jsonb_agg
                   FROM (((contact_form_modal_inputs cfmi
                     JOIN contact_form_inputs cfi ON ((cfmi.contact_form_input_id = cfi.id)))
                     JOIN form_inputs fi ON ((cfi.form_input_id = fi.id)))
                     LEFT JOIN ref_tag rt ON ((fi.tag_id = rt.id)))
                  WHERE (cfmi.contact_form_modal_id = cfm.id)))) AS doc
           FROM contact_form_modal cfm
        )
 SELECT (cleaned.doc ->> 'id'::text) AS id,
    (cleaned.doc ->> 'urlFormContent'::text) AS "urlFormContent",
    (cleaned.doc ->> 'urlApi'::text) AS "urlApi",
    (cleaned.doc ->> 'submitButtonName'::text) AS "submitButtonName",
    (cleaned.doc ->> 'title'::text) AS title,
    (cleaned.doc ->> 'subtitle'::text) AS subtitle,
    (cleaned.doc -> 'alertOnSubmit'::text) AS "alertOnSubmit",
    (cleaned.doc -> 'dataFormContent'::text) AS "dataFormContent"
   FROM cleaned;


create or replace view "public"."project_summary" as  SELECT strip_nulls_recursively(jsonb_build_object('id', p.id, 'title', p.title, 'description', p.description, 'tags', COALESCE(tag_agg.techno_names, '{}'::text[]), 'picture', p.picture, 'display', p.display, 'deliverables', COALESCE(deliv_agg.deliverables, '[]'::jsonb))) AS project
   FROM ((projects p
     LEFT JOIN LATERAL ( SELECT array_agg(rt.name) AS techno_names
           FROM (project_techno pt
             JOIN ref_techno rt ON ((pt.techno_id = rt.id)))
          WHERE (pt.project_id = p.id)) tag_agg ON (true))
     LEFT JOIN LATERAL ( SELECT jsonb_agg(jsonb_build_object('id', (pd.id)::text, 'service', a.service, 'icon', a.icon, 'address', a.address, 'path', pd.path)) AS deliverables
           FROM (project_deliverables pd
             JOIN accounts a ON ((pd.account_id = a.id)))
          WHERE (pd.project_id = p.id)) deliv_agg ON (true));


grant select on table "public"."accounts" to PUBLIC;

grant delete on table "public"."accounts" to "anon";

grant insert on table "public"."accounts" to "anon";

grant references on table "public"."accounts" to "anon";

grant select on table "public"."accounts" to "anon";

grant trigger on table "public"."accounts" to "anon";

grant truncate on table "public"."accounts" to "anon";

grant update on table "public"."accounts" to "anon";

grant delete on table "public"."accounts" to "authenticated";

grant insert on table "public"."accounts" to "authenticated";

grant references on table "public"."accounts" to "authenticated";

grant select on table "public"."accounts" to "authenticated";

grant trigger on table "public"."accounts" to "authenticated";

grant truncate on table "public"."accounts" to "authenticated";

grant update on table "public"."accounts" to "authenticated";

grant delete on table "public"."accounts" to "service_role";

grant insert on table "public"."accounts" to "service_role";

grant references on table "public"."accounts" to "service_role";

grant select on table "public"."accounts" to "service_role";

grant trigger on table "public"."accounts" to "service_role";

grant truncate on table "public"."accounts" to "service_role";

grant update on table "public"."accounts" to "service_role";

grant select on table "public"."bold_detail_sections" to PUBLIC;

grant delete on table "public"."bold_detail_sections" to "anon";

grant insert on table "public"."bold_detail_sections" to "anon";

grant references on table "public"."bold_detail_sections" to "anon";

grant select on table "public"."bold_detail_sections" to "anon";

grant trigger on table "public"."bold_detail_sections" to "anon";

grant truncate on table "public"."bold_detail_sections" to "anon";

grant update on table "public"."bold_detail_sections" to "anon";

grant delete on table "public"."bold_detail_sections" to "authenticated";

grant insert on table "public"."bold_detail_sections" to "authenticated";

grant references on table "public"."bold_detail_sections" to "authenticated";

grant select on table "public"."bold_detail_sections" to "authenticated";

grant trigger on table "public"."bold_detail_sections" to "authenticated";

grant truncate on table "public"."bold_detail_sections" to "authenticated";

grant update on table "public"."bold_detail_sections" to "authenticated";

grant delete on table "public"."bold_detail_sections" to "service_role";

grant insert on table "public"."bold_detail_sections" to "service_role";

grant references on table "public"."bold_detail_sections" to "service_role";

grant select on table "public"."bold_detail_sections" to "service_role";

grant trigger on table "public"."bold_detail_sections" to "service_role";

grant truncate on table "public"."bold_detail_sections" to "service_role";

grant update on table "public"."bold_detail_sections" to "service_role";

grant select on table "public"."contact_form_inputs" to PUBLIC;

grant select on table "public"."contact_form_inputs" to "anon";

grant select on table "public"."contact_form_inputs" to "authenticated";

grant select on table "public"."contact_form_modal" to PUBLIC;

grant select on table "public"."contact_form_modal" to "anon";

grant select on table "public"."contact_form_modal" to "authenticated";

grant select on table "public"."contact_form_modal_inputs" to PUBLIC;

grant select on table "public"."contact_form_modal_inputs" to "anon";

grant select on table "public"."contact_form_modal_inputs" to "authenticated";

grant select on table "public"."contact_form_tooltips" to PUBLIC;

grant select on table "public"."contact_form_tooltips" to "anon";

grant select on table "public"."contact_form_tooltips" to "authenticated";

grant select on table "public"."detail_sections" to PUBLIC;

grant delete on table "public"."detail_sections" to "anon";

grant insert on table "public"."detail_sections" to "anon";

grant references on table "public"."detail_sections" to "anon";

grant select on table "public"."detail_sections" to "anon";

grant trigger on table "public"."detail_sections" to "anon";

grant truncate on table "public"."detail_sections" to "anon";

grant update on table "public"."detail_sections" to "anon";

grant delete on table "public"."detail_sections" to "authenticated";

grant insert on table "public"."detail_sections" to "authenticated";

grant references on table "public"."detail_sections" to "authenticated";

grant select on table "public"."detail_sections" to "authenticated";

grant trigger on table "public"."detail_sections" to "authenticated";

grant truncate on table "public"."detail_sections" to "authenticated";

grant update on table "public"."detail_sections" to "authenticated";

grant delete on table "public"."detail_sections" to "service_role";

grant insert on table "public"."detail_sections" to "service_role";

grant references on table "public"."detail_sections" to "service_role";

grant select on table "public"."detail_sections" to "service_role";

grant trigger on table "public"."detail_sections" to "service_role";

grant truncate on table "public"."detail_sections" to "service_role";

grant update on table "public"."detail_sections" to "service_role";

grant select on table "public"."error_messages" to PUBLIC;

grant select on table "public"."error_messages" to "anon";

grant select on table "public"."error_messages" to "authenticated";

grant select on table "public"."form_inputs" to PUBLIC;

grant select on table "public"."form_inputs" to "anon";

grant select on table "public"."form_inputs" to "authenticated";

grant select on table "public"."menu_items" to PUBLIC;

grant delete on table "public"."menu_items" to "anon";

grant insert on table "public"."menu_items" to "anon";

grant references on table "public"."menu_items" to "anon";

grant select on table "public"."menu_items" to "anon";

grant trigger on table "public"."menu_items" to "anon";

grant truncate on table "public"."menu_items" to "anon";

grant update on table "public"."menu_items" to "anon";

grant delete on table "public"."menu_items" to "authenticated";

grant insert on table "public"."menu_items" to "authenticated";

grant references on table "public"."menu_items" to "authenticated";

grant select on table "public"."menu_items" to "authenticated";

grant trigger on table "public"."menu_items" to "authenticated";

grant truncate on table "public"."menu_items" to "authenticated";

grant update on table "public"."menu_items" to "authenticated";

grant delete on table "public"."menu_items" to "service_role";

grant insert on table "public"."menu_items" to "service_role";

grant references on table "public"."menu_items" to "service_role";

grant select on table "public"."menu_items" to "service_role";

grant trigger on table "public"."menu_items" to "service_role";

grant truncate on table "public"."menu_items" to "service_role";

grant update on table "public"."menu_items" to "service_role";

grant select on table "public"."project_deliverables" to PUBLIC;

grant delete on table "public"."project_deliverables" to "anon";

grant insert on table "public"."project_deliverables" to "anon";

grant references on table "public"."project_deliverables" to "anon";

grant select on table "public"."project_deliverables" to "anon";

grant trigger on table "public"."project_deliverables" to "anon";

grant truncate on table "public"."project_deliverables" to "anon";

grant update on table "public"."project_deliverables" to "anon";

grant delete on table "public"."project_deliverables" to "authenticated";

grant insert on table "public"."project_deliverables" to "authenticated";

grant references on table "public"."project_deliverables" to "authenticated";

grant select on table "public"."project_deliverables" to "authenticated";

grant trigger on table "public"."project_deliverables" to "authenticated";

grant truncate on table "public"."project_deliverables" to "authenticated";

grant update on table "public"."project_deliverables" to "authenticated";

grant delete on table "public"."project_deliverables" to "service_role";

grant insert on table "public"."project_deliverables" to "service_role";

grant references on table "public"."project_deliverables" to "service_role";

grant select on table "public"."project_deliverables" to "service_role";

grant trigger on table "public"."project_deliverables" to "service_role";

grant truncate on table "public"."project_deliverables" to "service_role";

grant update on table "public"."project_deliverables" to "service_role";

grant select on table "public"."project_techno" to PUBLIC;

grant delete on table "public"."project_techno" to "anon";

grant insert on table "public"."project_techno" to "anon";

grant references on table "public"."project_techno" to "anon";

grant select on table "public"."project_techno" to "anon";

grant trigger on table "public"."project_techno" to "anon";

grant truncate on table "public"."project_techno" to "anon";

grant update on table "public"."project_techno" to "anon";

grant delete on table "public"."project_techno" to "authenticated";

grant insert on table "public"."project_techno" to "authenticated";

grant references on table "public"."project_techno" to "authenticated";

grant select on table "public"."project_techno" to "authenticated";

grant trigger on table "public"."project_techno" to "authenticated";

grant truncate on table "public"."project_techno" to "authenticated";

grant update on table "public"."project_techno" to "authenticated";

grant delete on table "public"."project_techno" to "service_role";

grant insert on table "public"."project_techno" to "service_role";

grant references on table "public"."project_techno" to "service_role";

grant select on table "public"."project_techno" to "service_role";

grant trigger on table "public"."project_techno" to "service_role";

grant truncate on table "public"."project_techno" to "service_role";

grant update on table "public"."project_techno" to "service_role";

grant select on table "public"."projects" to PUBLIC;

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

grant select on table "public"."ref_anchor" to PUBLIC;

grant delete on table "public"."ref_anchor" to "anon";

grant insert on table "public"."ref_anchor" to "anon";

grant references on table "public"."ref_anchor" to "anon";

grant select on table "public"."ref_anchor" to "anon";

grant trigger on table "public"."ref_anchor" to "anon";

grant truncate on table "public"."ref_anchor" to "anon";

grant update on table "public"."ref_anchor" to "anon";

grant delete on table "public"."ref_anchor" to "authenticated";

grant insert on table "public"."ref_anchor" to "authenticated";

grant references on table "public"."ref_anchor" to "authenticated";

grant select on table "public"."ref_anchor" to "authenticated";

grant trigger on table "public"."ref_anchor" to "authenticated";

grant truncate on table "public"."ref_anchor" to "authenticated";

grant update on table "public"."ref_anchor" to "authenticated";

grant delete on table "public"."ref_anchor" to "service_role";

grant insert on table "public"."ref_anchor" to "service_role";

grant references on table "public"."ref_anchor" to "service_role";

grant select on table "public"."ref_anchor" to "service_role";

grant trigger on table "public"."ref_anchor" to "service_role";

grant truncate on table "public"."ref_anchor" to "service_role";

grant update on table "public"."ref_anchor" to "service_role";

grant select on table "public"."ref_tag" to PUBLIC;

grant delete on table "public"."ref_tag" to "anon";

grant insert on table "public"."ref_tag" to "anon";

grant references on table "public"."ref_tag" to "anon";

grant select on table "public"."ref_tag" to "anon";

grant trigger on table "public"."ref_tag" to "anon";

grant truncate on table "public"."ref_tag" to "anon";

grant update on table "public"."ref_tag" to "anon";

grant delete on table "public"."ref_tag" to "authenticated";

grant insert on table "public"."ref_tag" to "authenticated";

grant references on table "public"."ref_tag" to "authenticated";

grant select on table "public"."ref_tag" to "authenticated";

grant trigger on table "public"."ref_tag" to "authenticated";

grant truncate on table "public"."ref_tag" to "authenticated";

grant update on table "public"."ref_tag" to "authenticated";

grant delete on table "public"."ref_tag" to "service_role";

grant insert on table "public"."ref_tag" to "service_role";

grant references on table "public"."ref_tag" to "service_role";

grant select on table "public"."ref_tag" to "service_role";

grant trigger on table "public"."ref_tag" to "service_role";

grant truncate on table "public"."ref_tag" to "service_role";

grant update on table "public"."ref_tag" to "service_role";

grant select on table "public"."ref_techno" to PUBLIC;

grant delete on table "public"."ref_techno" to "anon";

grant insert on table "public"."ref_techno" to "anon";

grant references on table "public"."ref_techno" to "anon";

grant select on table "public"."ref_techno" to "anon";

grant trigger on table "public"."ref_techno" to "anon";

grant truncate on table "public"."ref_techno" to "anon";

grant update on table "public"."ref_techno" to "anon";

grant delete on table "public"."ref_techno" to "authenticated";

grant insert on table "public"."ref_techno" to "authenticated";

grant references on table "public"."ref_techno" to "authenticated";

grant select on table "public"."ref_techno" to "authenticated";

grant trigger on table "public"."ref_techno" to "authenticated";

grant truncate on table "public"."ref_techno" to "authenticated";

grant update on table "public"."ref_techno" to "authenticated";

grant delete on table "public"."ref_techno" to "service_role";

grant insert on table "public"."ref_techno" to "service_role";

grant references on table "public"."ref_techno" to "service_role";

grant select on table "public"."ref_techno" to "service_role";

grant trigger on table "public"."ref_techno" to "service_role";

grant truncate on table "public"."ref_techno" to "service_role";

grant update on table "public"."ref_techno" to "service_role";

grant select on table "public"."showcase_sections" to PUBLIC;

grant delete on table "public"."showcase_sections" to "anon";

grant insert on table "public"."showcase_sections" to "anon";

grant references on table "public"."showcase_sections" to "anon";

grant select on table "public"."showcase_sections" to "anon";

grant trigger on table "public"."showcase_sections" to "anon";

grant truncate on table "public"."showcase_sections" to "anon";

grant update on table "public"."showcase_sections" to "anon";

grant delete on table "public"."showcase_sections" to "authenticated";

grant insert on table "public"."showcase_sections" to "authenticated";

grant references on table "public"."showcase_sections" to "authenticated";

grant select on table "public"."showcase_sections" to "authenticated";

grant trigger on table "public"."showcase_sections" to "authenticated";

grant truncate on table "public"."showcase_sections" to "authenticated";

grant update on table "public"."showcase_sections" to "authenticated";

grant delete on table "public"."showcase_sections" to "service_role";

grant insert on table "public"."showcase_sections" to "service_role";

grant references on table "public"."showcase_sections" to "service_role";

grant select on table "public"."showcase_sections" to "service_role";

grant trigger on table "public"."showcase_sections" to "service_role";

grant truncate on table "public"."showcase_sections" to "service_role";

grant update on table "public"."showcase_sections" to "service_role";

grant select on table "public"."skills" to PUBLIC;

grant delete on table "public"."skills" to "anon";

grant insert on table "public"."skills" to "anon";

grant references on table "public"."skills" to "anon";

grant select on table "public"."skills" to "anon";

grant trigger on table "public"."skills" to "anon";

grant truncate on table "public"."skills" to "anon";

grant update on table "public"."skills" to "anon";

grant delete on table "public"."skills" to "authenticated";

grant insert on table "public"."skills" to "authenticated";

grant references on table "public"."skills" to "authenticated";

grant select on table "public"."skills" to "authenticated";

grant trigger on table "public"."skills" to "authenticated";

grant truncate on table "public"."skills" to "authenticated";

grant update on table "public"."skills" to "authenticated";

grant delete on table "public"."skills" to "service_role";

grant insert on table "public"."skills" to "service_role";

grant references on table "public"."skills" to "service_role";

grant select on table "public"."skills" to "service_role";

grant trigger on table "public"."skills" to "service_role";

grant truncate on table "public"."skills" to "service_role";

grant update on table "public"."skills" to "service_role";

create policy "Allow authenticated delete"
on "public"."accounts"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Allow authenticated insert"
on "public"."accounts"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Allow authenticated update"
on "public"."accounts"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Read-only public"
on "public"."accounts"
as permissive
for select
to public
using (true);


create policy "Allow authenticated delete"
on "public"."bold_detail_sections"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Allow authenticated insert"
on "public"."bold_detail_sections"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Allow authenticated update"
on "public"."bold_detail_sections"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Read-only public"
on "public"."bold_detail_sections"
as permissive
for select
to public
using (true);


create policy "Allow authenticated delete"
on "public"."contact_form_inputs"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Allow authenticated insert"
on "public"."contact_form_inputs"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Allow authenticated update"
on "public"."contact_form_inputs"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Read-only public"
on "public"."contact_form_inputs"
as permissive
for select
to public
using (true);


create policy "Allow authenticated delete"
on "public"."contact_form_modal"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Allow authenticated insert"
on "public"."contact_form_modal"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Allow authenticated update"
on "public"."contact_form_modal"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Read-only public"
on "public"."contact_form_modal"
as permissive
for select
to public
using (true);


create policy "Allow authenticated delete"
on "public"."contact_form_modal_inputs"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Allow authenticated insert"
on "public"."contact_form_modal_inputs"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Allow authenticated update"
on "public"."contact_form_modal_inputs"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Read-only public"
on "public"."contact_form_modal_inputs"
as permissive
for select
to public
using (true);


create policy "Allow authenticated delete"
on "public"."contact_form_tooltips"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Allow authenticated insert"
on "public"."contact_form_tooltips"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Allow authenticated update"
on "public"."contact_form_tooltips"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Read-only public"
on "public"."contact_form_tooltips"
as permissive
for select
to public
using (true);


create policy "Allow authenticated delete"
on "public"."detail_sections"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Allow authenticated insert"
on "public"."detail_sections"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Allow authenticated update"
on "public"."detail_sections"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Read-only public"
on "public"."detail_sections"
as permissive
for select
to public
using (true);


create policy "Allow authenticated delete"
on "public"."error_messages"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Allow authenticated insert"
on "public"."error_messages"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Allow authenticated update"
on "public"."error_messages"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Read-only public"
on "public"."error_messages"
as permissive
for select
to public
using (true);


create policy "Allow authenticated delete"
on "public"."form_inputs"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Allow authenticated insert"
on "public"."form_inputs"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Allow authenticated update"
on "public"."form_inputs"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Read-only public"
on "public"."form_inputs"
as permissive
for select
to public
using (true);


create policy "Allow authenticated delete"
on "public"."menu_items"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Allow authenticated insert"
on "public"."menu_items"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Allow authenticated update"
on "public"."menu_items"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Read-only public"
on "public"."menu_items"
as permissive
for select
to public
using (true);


create policy "Allow authenticated delete"
on "public"."project_deliverables"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Allow authenticated insert"
on "public"."project_deliverables"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Allow authenticated update"
on "public"."project_deliverables"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Read-only public"
on "public"."project_deliverables"
as permissive
for select
to public
using (true);


create policy "Allow authenticated delete"
on "public"."project_techno"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Allow authenticated insert"
on "public"."project_techno"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Allow authenticated update"
on "public"."project_techno"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Read-only public"
on "public"."project_techno"
as permissive
for select
to public
using (true);


create policy "Allow authenticated delete"
on "public"."projects"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Allow authenticated insert"
on "public"."projects"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Allow authenticated update"
on "public"."projects"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Read-only public"
on "public"."projects"
as permissive
for select
to public
using (true);


create policy "Allow authenticated delete"
on "public"."showcase_sections"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Allow authenticated insert"
on "public"."showcase_sections"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Allow authenticated update"
on "public"."showcase_sections"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Read-only public"
on "public"."showcase_sections"
as permissive
for select
to public
using (true);


create policy "Allow authenticated delete"
on "public"."skills"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Allow authenticated insert"
on "public"."skills"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Allow authenticated update"
on "public"."skills"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Read-only public"
on "public"."skills"
as permissive
for select
to public
using (true);




