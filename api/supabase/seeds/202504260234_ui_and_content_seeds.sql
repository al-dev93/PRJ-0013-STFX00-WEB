INSERT INTO public.menu_items (id,"label",anchor_id,user_id) VALUES
	 ('594cc5d2-232f-40cd-b0fe-10b6d984d71f'::uuid,'accueil',1,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('20b324ed-de4a-4daf-890e-64b7eda21ff6'::uuid,'à propos',2,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('f86b3b53-7fbf-41cb-9f9a-cb2dbfb488a9'::uuid,'réalisations',3,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.skills (id,skill,value,font,font_size,font_style,font_weight,user_id) VALUES
	 ('7296d468-5dd9-4e5a-bbc9-a2bf5ce48c9c'::uuid,'Créativité',50,NULL,NULL,NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('4128118c-2cc3-40cc-b7d3-e45c93e2e753'::uuid,'Gestion de projet',39,NULL,NULL,NULL,NULL,NULL),
	 ('948155a6-85bc-41c2-8823-541513bcbc75'::uuid,'Résolution de problème',46,NULL,NULL,NULL,NULL,NULL),
	 ('91d7b372-82f1-43b7-b39d-9ccf04ed88d6'::uuid,'Curiosité',37,NULL,NULL,NULL,NULL,NULL),
	 ('bd4dbf7e-f59b-4479-9911-a55b6074164c'::uuid,'Agilité',40,NULL,NULL,NULL,NULL,NULL),
	 ('27f56453-ba6a-4223-bc39-7e204e8e8865'::uuid,'Écoute',48,NULL,NULL,NULL,NULL,NULL),
	 ('0b923b1a-77a7-4881-b5b3-dc5aada26f2d'::uuid,'Testing',18,NULL,NULL,NULL,NULL,NULL),
	 ('9eb90de8-4673-4575-8926-587d49ac100e'::uuid,'React',38,NULL,NULL,NULL,NULL,NULL),
	 ('55e07952-306e-4222-92df-dab7182a6e8c'::uuid,'TypeScript',22,NULL,NULL,NULL,NULL,NULL);
INSERT INTO public.accounts (id,service,icon,on_page,address,user_id) VALUES
	 ('bf7e220a-b514-4e6b-bfbe-728cd79cb193'::uuid,'gmail','paper-plane-outline',true,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('960322b1-0647-4cf5-95fe-64c7b33c3c74'::uuid,'linkedin','logo-linkedin',true,'https://www.linkedin.com/in/alain-larose/','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('b2ad7f52-06db-4378-ae6a-ee789e8271de'::uuid,'github','logo-github',true,'https://github.com/al-dev93','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('f015fe8c-3ea9-4a31-91cc-40369d26941f'::uuid,'npm','logo-npm',NULL,'https://www.npmjs.com','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('38f539e1-bac4-4c4b-b439-03d42870d229'::uuid,'figma','logo-figma',NULL,'https://www.figma.com','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('0aa97592-e9ae-43d4-b85e-3241f14d7187'::uuid,'external','open-outline',NULL,'⚠️ à définir','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('22f596b1-ee5c-4274-b24b-b60193d61592'::uuid,'document','document-outline',NULL,'⚠️ à définir','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.showcase_sections (id,anchor_id,user_id,title) VALUES
	 ('0d04a950-8a77-4d4c-9d9b-7492ed9568cb'::uuid,1,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,NULL),
	 ('7540567d-0fa6-49a2-a2fd-6a634cf0c784'::uuid,2,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'À propos d''AlgoNetDesign'),
	 ('10126a4d-f5bf-4d5e-9433-8a67ffeea5e9'::uuid,3,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'Principales réalisations'),
	 ('d84e0691-528b-4f7e-b507-6efca345ff46'::uuid,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'Autres réalisations');
INSERT INTO public.detail_sections (id,tag_id,name,"content",url_content,wrapped,user_id,showcase_section_id) VALUES
	 ('bad995fe-c1c7-4846-a9d0-bc3a8840889f'::uuid,7,'catchPhrase','Donnez vie à vos interfaces',NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'0d04a950-8a77-4d4c-9d9b-7492ed9568cb'::uuid),
	 ('fe469bee-47ef-4d0a-838f-07617244c7d1'::uuid,3,'title','AlgoNetDesign',NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'0d04a950-8a77-4d4c-9d9b-7492ed9568cb'::uuid),
	 ('87b90d4c-67fa-45ea-b2df-ffb0d1ff026e'::uuid,7,'slogan','Créatrice d''applications web réactives',NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'0d04a950-8a77-4d4c-9d9b-7492ed9568cb'::uuid),
	 ('41447ef2-19eb-44ae-984e-64e4ce4d55c9'::uuid,7,'businessOverview','AlgoNetDesign développe et conçoit des applications web performantes et esthétiques. Elle s''attache à respecter votre volonté de proposer des interfaces centrées sur l''humain, adaptées aux formats actuels d''écrans et satisfaisant les critères d’accessibilité.',NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'0d04a950-8a77-4d4c-9d9b-7492ed9568cb'::uuid),
	 ('5a4c2f81-edae-4444-a34f-c9cf005d5fea'::uuid,7,'description','Développeur concepteur de logiciel, j’ai choisi de déployer mon activité en l’adossant à une société unipersonnelle: AlgoNetDesign.',NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'7540567d-0fa6-49a2-a2fd-6a634cf0c784'::uuid),
	 ('0032a177-50d0-4913-abfa-196ddc096ab3'::uuid,7,'description','Spécialisée dans le développement Front-end, AlgoNetDesign peut intégrer une maquette existante ou la créer en élaborant le design avec vous.',NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'7540567d-0fa6-49a2-a2fd-6a634cf0c784'::uuid),
	 ('9df67e83-b046-4aa6-9826-8ab8eb53ef22'::uuid,7,'description','AlgoNetDesign peut également vous aider à mettre en oeuvre ou à améliorer votre projet. Elle proposera ainsi de déboguer un code défectueux, de refactoriser une base de code pour l''optimiser, de créer des tests pour accroître la fiabilité, ou encore de convertir une application avec des technologies récentes.',NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'7540567d-0fa6-49a2-a2fd-6a634cf0c784'::uuid),
	 ('13acd3ce-2b77-48e1-85c1-67e87d1f6510'::uuid,7,'description','HTML et CSS sont au cœur des technologies maîtrisées par AlgoNetDesign. Elles sont complétées par la liste ci-dessous. Enfin, pour une application nécessitant un Back-end modeste, AlgoNetDesign peut en assurer la création.',NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'7540567d-0fa6-49a2-a2fd-6a634cf0c784'::uuid),
	 ('3f26a5ce-2c10-4781-b9ee-3b4ac3febb86'::uuid,10,NULL,NULL,'⚠️ à définir voir skills',NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'7540567d-0fa6-49a2-a2fd-6a634cf0c784'::uuid),
	 ('83448041-ee9d-4538-8997-c79a24c40104'::uuid,11,NULL,NULL,'⚠️ à définir voir projects slideshow',NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'10126a4d-f5bf-4d5e-9433-8a67ffeea5e9'::uuid),
	 ('b9314518-f27f-497b-901d-cc8fec6740de'::uuid,9,'cardsWrapper',NULL,'⚠️ à définir voir projects cards',true,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'d84e0691-528b-4f7e-b507-6efca345ff46'::uuid);
INSERT INTO public.bold_detail_sections (id,tag_id,"content",user_id,detail_section_id) VALUES
	 ('9fa9daa5-2ddb-45d7-9419-1f8f44de7b11'::uuid,2,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'0032a177-50d0-4913-abfa-196ddc096ab3'::uuid),
	 ('be906efa-322e-449f-87e2-0dd68bfe329c'::uuid,1,'AlgoNetDesign répond à votre attente d''interface utilisateur esthétique, responsive et accessible.','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'0032a177-50d0-4913-abfa-196ddc096ab3'::uuid),
	 ('0d09411c-cbe7-4029-bd42-f2b0c76f948d'::uuid,2,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'9df67e83-b046-4aa6-9826-8ab8eb53ef22'::uuid),
	 ('0f85e2a6-9195-498e-800f-b39a7046da0b'::uuid,1,'AlgoNetDesign oeuvre pour la performance de votre projet.','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'9df67e83-b046-4aa6-9826-8ab8eb53ef22'::uuid),
	 ('ca1cef37-dcef-4586-9cc8-5cd878c3d3f8'::uuid,2,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'13acd3ce-2b77-48e1-85c1-67e87d1f6510'::uuid),
	 ('70da16db-d695-4b3d-8785-c4e2ebd0c860'::uuid,1,'AlgoNetDesign s''appuie sur un large éventail de technologie pour proposer des applications dynamiques et réactives','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'13acd3ce-2b77-48e1-85c1-67e87d1f6510'::uuid);
