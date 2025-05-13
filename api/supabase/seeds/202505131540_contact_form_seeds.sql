INSERT INTO public.contact_form_modal (id,submit_button_name,title,subtitle,alert_on_submit,user_id) VALUES
	 ('contact','Envoyer','Prenez Contact !','une demande, un projet...','{"Votre message a été envoyé","Il sera traité dans les plus brefs délais"}','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.form_inputs (id,"type",placeholder,required,max_length,min_length,pattern,tag_id,user_id) VALUES
	 ('bd00c0f0-b1c4-4cec-8a47-096cc231f703'::uuid,'text','nom de l''entreprise',NULL,128,2,NULL,6,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('bdcca182-2b60-4817-8248-6649fa3abf79'::uuid,'tel','0X XX XX XX XX',NULL,NULL,NULL,'^0[1-9]( [0-9]{2}){4}$',6,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('397ef3e0-6a9c-4c9c-a84c-9c6423f40023'::uuid,NULL,'votre message',true,1000,20,NULL,8,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('87c6d340-4877-47ec-89e0-1464c0d69043'::uuid,'checkbox',NULL,true,NULL,NULL,NULL,6,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('d02a45a0-d14a-46f4-b6ab-5e28635fd019'::uuid,'text','prénom - nom',true,100,2,'^[a-zA-ZÀ-ÿ\x27\-\s]+$',6,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('dfe227ba-7ace-4f85-8ab1-cb0067d27cb8'::uuid,'email','adresse mail valide',true,NULL,NULL,'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]{2,}[.][a-zA-Z]{2,}$',6,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.contact_form_inputs (id,"label",form_input_id,user_id) VALUES
	 ('name','Nom','d02a45a0-d14a-46f4-b6ab-5e28635fd019'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('company','Entreprise','bd00c0f0-b1c4-4cec-8a47-096cc231f703'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('email','Email','dfe227ba-7ace-4f85-8ab1-cb0067d27cb8'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('tel','Téléphone','bdcca182-2b60-4817-8248-6649fa3abf79'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('message','Message','397ef3e0-6a9c-4c9c-a84c-9c6423f40023'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('consent','J''accepte le stockage de mes données pour cette demande de contact','87c6d340-4877-47ec-89e0-1464c0d69043'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.contact_form_modal_inputs (contact_form_modal_id,contact_form_input_id,user_id) VALUES
	 ('contact','name','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('contact','company','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('contact','email','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('contact','tel','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('contact','message','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('contact','consent','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.contact_form_tooltips (id,contact_form_input_id,line,line_height,user_id) VALUES
	 ('0f69686f-d2a5-4dbc-b366-d70122c9d699'::uuid,'name','Type information attendue',1,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('74879f18-5d97-4aec-98f0-9196d0921446'::uuid,'name','lettres, espace, tiret admis',NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('f81a2349-d348-421c-a1ee-829df6d370a6'::uuid,'email','Type information attendue',1,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('a47f5ed6-877e-42d4-8b6e-f11a9d7a62aa'::uuid,'email','adresse mail valide',NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('73499e7f-bb67-4091-9d75-814598472165'::uuid,'message','Type information attendue',1,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('f7fae605-5836-4263-8503-c5f74edc20bd'::uuid,'message','caractères alphanumériques',NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.error_messages (id,form_input_id,pattern_mismatch,too_long,too_short,value_missing,user_id) VALUES
	 ('2c01025f-c4f4-422d-b2d7-8f666bc0d404'::uuid,'d02a45a0-d14a-46f4-b6ab-5e28635fd019'::uuid,'Accepte les caractères alphabétiques\nminuscules, majuscules, accentués\nl''espace, le tiret ou l''apostrophe','Longueur maximale atteinte','Comprend au moins 2 caractères','Doit être renseigné','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('068af34c-e0fd-4bb5-8c2e-16bb0ef0017b'::uuid,'bd00c0f0-b1c4-4cec-8a47-096cc231f703'::uuid,NULL,'Longueur maximale atteinte','Comprend au moins 2 caractères',NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('4ecd18b2-c9ab-4f6f-a9fe-7368a767e891'::uuid,'dfe227ba-7ace-4f85-8ab1-cb0067d27cb8'::uuid,'L''adresse n''est pas correct',NULL,NULL,'Doit être renseigné','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('d11eb787-55c0-4d94-8eee-a5cfbb93af5e'::uuid,'bdcca182-2b60-4817-8248-6649fa3abf79'::uuid,'Commence par 0, il est composé de\n5 fois 2 chiffres séparés d''un espace',NULL,NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('59dbf1d7-6333-4439-b8c5-b134d2abd221'::uuid,'397ef3e0-6a9c-4c9c-a84c-9c6423f40023'::uuid,NULL,'Maximum de 1000 caractères atteint','Un message a un contenu minimal','Doit être rédigé','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);

