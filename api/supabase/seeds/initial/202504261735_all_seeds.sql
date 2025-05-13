INSERT INTO public.accounts (id,service,icon,on_page,address,user_id) VALUES
	 ('bf7e220a-b514-4e6b-bfbe-728cd79cb193'::uuid,'gmail','paper-plane-outline',true,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('960322b1-0647-4cf5-95fe-64c7b33c3c74'::uuid,'linkedin','logo-linkedin',true,'https://www.linkedin.com/in/alain-larose/','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('b2ad7f52-06db-4378-ae6a-ee789e8271de'::uuid,'github','logo-github',true,'https://github.com/al-dev93','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('f015fe8c-3ea9-4a31-91cc-40369d26941f'::uuid,'npm','logo-npm',NULL,'https://www.npmjs.com','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('38f539e1-bac4-4c4b-b439-03d42870d229'::uuid,'figma','logo-figma',NULL,'https://www.figma.com','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('0aa97592-e9ae-43d4-b85e-3241f14d7187'::uuid,'external','open-outline',NULL,'⚠️ à définir','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('22f596b1-ee5c-4274-b24b-b60193d61592'::uuid,'document','document-outline',NULL,'⚠️ à définir','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.bold_detail_sections (id,tag_id,"content",user_id,detail_section_id) VALUES
	 ('9fa9daa5-2ddb-45d7-9419-1f8f44de7b11'::uuid,2,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'0032a177-50d0-4913-abfa-196ddc096ab3'::uuid),
	 ('be906efa-322e-449f-87e2-0dd68bfe329c'::uuid,1,'AlgoNetDesign répond à votre attente d''interface utilisateur esthétique, responsive et accessible.','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'0032a177-50d0-4913-abfa-196ddc096ab3'::uuid),
	 ('0d09411c-cbe7-4029-bd42-f2b0c76f948d'::uuid,2,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'9df67e83-b046-4aa6-9826-8ab8eb53ef22'::uuid),
	 ('0f85e2a6-9195-498e-800f-b39a7046da0b'::uuid,1,'AlgoNetDesign oeuvre pour la performance de votre projet.','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'9df67e83-b046-4aa6-9826-8ab8eb53ef22'::uuid),
	 ('ca1cef37-dcef-4586-9cc8-5cd878c3d3f8'::uuid,2,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'13acd3ce-2b77-48e1-85c1-67e87d1f6510'::uuid),
	 ('70da16db-d695-4b3d-8785-c4e2ebd0c860'::uuid,1,'AlgoNetDesign s''appuie sur un large éventail de technologie pour proposer des applications dynamiques et réactives','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'13acd3ce-2b77-48e1-85c1-67e87d1f6510'::uuid);
INSERT INTO public.contact_form_inputs (id,"label",form_input_id,user_id) VALUES
	 ('name','Nom','d02a45a0-d14a-46f4-b6ab-5e28635fd019'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('company','Entreprise','bd00c0f0-b1c4-4cec-8a47-096cc231f703'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('email','Email','dfe227ba-7ace-4f85-8ab1-cb0067d27cb8'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('tel','Téléphone','bdcca182-2b60-4817-8248-6649fa3abf79'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('message','Message','397ef3e0-6a9c-4c9c-a84c-9c6423f40023'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('consent','J''accepte le stockage de mes données pour cette demande de contact','87c6d340-4877-47ec-89e0-1464c0d69043'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.contact_form_modal (id,url_form_content,url_api,submit_button_name,title,subtitle,alert_on_submit,user_id) VALUES
	 ('contact','⚠️ à supprimer','⚠️ donner la bonne adresse','Envoyer','Prenez Contact !','une demande, un projet...','{"Votre message a été envoyé","Il sera traité dans les plus brefs délais"}','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
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
INSERT INTO public.detail_sections (id,tag_id,"name","content",url_content,wrapped,user_id,showcase_section_id) VALUES
	 ('bad995fe-c1c7-4846-a9d0-bc3a8840889f'::uuid,7,'catchPhrase','Donnez vie à vos interfaces',NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'0d04a950-8a77-4d4c-9d9b-7492ed9568cb'::uuid),
	 ('fe469bee-47ef-4d0a-838f-07617244c7d1'::uuid,3,'title','AlgoNetDesign',NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'0d04a950-8a77-4d4c-9d9b-7492ed9568cb'::uuid),
	 ('87b90d4c-67fa-45ea-b2df-ffb0d1ff026e'::uuid,7,'slogan','Créatrice d''applications web réactives',NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'0d04a950-8a77-4d4c-9d9b-7492ed9568cb'::uuid),
	 ('41447ef2-19eb-44ae-984e-64e4ce4d55c9'::uuid,7,'businessOverview','AlgoNetDesign développe et conçoit des applications web performantes et esthétiques. Elle s''attache à respecter votre volonté de proposer des interfaces centrées sur l''humain, adaptées aux formats actuels d''écrans et satisfaisant les critères d’accessibilité.',NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'0d04a950-8a77-4d4c-9d9b-7492ed9568cb'::uuid),
	 ('5a4c2f81-edae-4444-a34f-c9cf005d5fea'::uuid,7,'description','Développeur concepteur de logiciel, j’ai choisi de déployer mon activité en l’adossant à une société unipersonnelle: AlgoNetDesign.',NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'7540567d-0fa6-49a2-a2fd-6a634cf0c784'::uuid),
	 ('0032a177-50d0-4913-abfa-196ddc096ab3'::uuid,7,'description','Spécialisée dans le développement Front-end, AlgoNetDesign peut intégrer une maquette existante ou la créer en élaborant le design avec vous.',NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'7540567d-0fa6-49a2-a2fd-6a634cf0c784'::uuid),
	 ('9df67e83-b046-4aa6-9826-8ab8eb53ef22'::uuid,7,'description','AlgoNetDesign peut également vous aider à mettre en oeuvre ou à améliorer votre projet. Elle proposera ainsi de déboguer un code défectueux, de refactoriser une base de code pour l''optimiser, de créer des tests pour accroître la fiabilité, ou encore de convertir une application avec des technologies récentes.',NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'7540567d-0fa6-49a2-a2fd-6a634cf0c784'::uuid),
	 ('13acd3ce-2b77-48e1-85c1-67e87d1f6510'::uuid,7,'description','HTML et CSS sont au cœur des technologies maîtrisées par AlgoNetDesign. Elles sont complétées par la liste ci-dessous. Enfin, pour une application nécessitant un Back-end modeste, AlgoNetDesign peut en assurer la création.',NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'7540567d-0fa6-49a2-a2fd-6a634cf0c784'::uuid),
	 ('3f26a5ce-2c10-4781-b9ee-3b4ac3febb86'::uuid,10,NULL,NULL,'⚠️ à définir voir skills',NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'7540567d-0fa6-49a2-a2fd-6a634cf0c784'::uuid),
	 ('83448041-ee9d-4538-8997-c79a24c40104'::uuid,11,NULL,NULL,'⚠️ à définir voir projects slideshow',NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'10126a4d-f5bf-4d5e-9433-8a67ffeea5e9'::uuid);
INSERT INTO public.detail_sections (id,tag_id,"name","content",url_content,wrapped,user_id,showcase_section_id) VALUES
	 ('b9314518-f27f-497b-901d-cc8fec6740de'::uuid,9,'cardsWrapper',NULL,'⚠️ à définir voir projects cards',true,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'d84e0691-528b-4f7e-b507-6efca345ff46'::uuid);
INSERT INTO public.error_messages (id,form_input_id,pattern_mismatch,too_long,too_short,value_missing,user_id) VALUES
	 ('2c01025f-c4f4-422d-b2d7-8f666bc0d404'::uuid,'d02a45a0-d14a-46f4-b6ab-5e28635fd019'::uuid,'Accepte les caractères alphabétiques\nminuscules, majuscules, accentués\nl''espace, le tiret ou l''apostrophe','Longueur maximale atteinte','Comprend au moins 2 caractères','Doit être renseigné','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('068af34c-e0fd-4bb5-8c2e-16bb0ef0017b'::uuid,'bd00c0f0-b1c4-4cec-8a47-096cc231f703'::uuid,NULL,'Longueur maximale atteinte','Comprend au moins 2 caractères',NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('4ecd18b2-c9ab-4f6f-a9fe-7368a767e891'::uuid,'dfe227ba-7ace-4f85-8ab1-cb0067d27cb8'::uuid,'L''adresse n''est pas correct',NULL,NULL,'Doit être renseigné','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('d11eb787-55c0-4d94-8eee-a5cfbb93af5e'::uuid,'bdcca182-2b60-4817-8248-6649fa3abf79'::uuid,'Commence par 0, il est composé de\n5 fois 2 chiffres séparés d''un espace',NULL,NULL,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('59dbf1d7-6333-4439-b8c5-b134d2abd221'::uuid,'397ef3e0-6a9c-4c9c-a84c-9c6423f40023'::uuid,NULL,'Maximum de 1000 caractères atteint','Un message a un contenu minimal','Doit être rédigé','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.form_inputs (id,"type",placeholder,required,max_length,min_length,pattern,tag_id,user_id) VALUES
	 ('d02a45a0-d14a-46f4-b6ab-5e28635fd019'::uuid,'text','prénom - nom',true,100,2,'^[a-zA-ZÀ-ÿ\\x27\\-\\s]+$',6,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('bd00c0f0-b1c4-4cec-8a47-096cc231f703'::uuid,'text','nom de l''entreprise',NULL,128,2,NULL,6,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('dfe227ba-7ace-4f85-8ab1-cb0067d27cb8'::uuid,'email','adresse mail valide',true,NULL,NULL,'^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]{2,}[.][a-zA-Z]{2,}$',6,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('bdcca182-2b60-4817-8248-6649fa3abf79'::uuid,'tel','0X XX XX XX XX',NULL,NULL,NULL,'^0[1-9]( [0-9]{2}){4}$',6,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('397ef3e0-6a9c-4c9c-a84c-9c6423f40023'::uuid,NULL,'votre message',true,1000,20,NULL,8,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('87c6d340-4877-47ec-89e0-1464c0d69043'::uuid,'checkbox',NULL,true,NULL,NULL,NULL,6,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.menu_items (id,"label",anchor_id,user_id) VALUES
	 ('594cc5d2-232f-40cd-b0fe-10b6d984d71f'::uuid,'accueil',1,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('20b324ed-de4a-4daf-890e-64b7eda21ff6'::uuid,'à propos',2,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('f86b3b53-7fbf-41cb-9f9a-cb2dbfb488a9'::uuid,'réalisations',3,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.projects (id,title,description,picture,display,user_id) VALUES
	 ('P3OHMY-al-2205','ohmyfood','Site de réservation caractérisé par des animations réalisées avec CSS',NULL,'card','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P4GAME-al-2206','GameOn','Validation de formulaire',NULL,'card','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P9BILD-al-2211','Billed','Débogage et tests d''une application RH',NULL,'card','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p13agba-al-2302','ARGENT BANK','à compléter',NULL,'card','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p14hnet-al-2303','HRnet','Plugin React pour créer une table de données intégrant des fonctions de tri multicritères, de filtrage, de pagination et d''affichage d''informations.',NULL,'card','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('sasu-al-2307','Sasu','Site vitrine de Sasu. Un lien propose l''accès à la maquette Figma.',NULL,'card','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P6FEYE-al-2207','FishEye','Site web pour photographes freelances, il a été conçu en respectant les critères d’accessibilité conforment aux  WCAG. La page du photographe est générée dynamiquement grâce à JavaScript, en fonction du photographe sélectionné sur la page d’accueil. Les travaux du photographe sont affichés dans une galerie de miniatures, et peuvent être visualisés individuellement (photographie ou vidéo) dans une lightbox contenant un slider. Un système de like permet d’évaluer le cliché.','⚠️ FishEye.png','slideshow','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p7LPPA-al-2208','les petits plats','Ce site de recettes de cuisine, devait disposer d’un algorithme de recherche performant. Un champ texte et un système de tags sont utilisés pour réaliser la recherche, les deux pouvant se combiner. Deux algorithmes différents ont été créés et comparés grâce à jsben.ch. L’affichage des fiches recettes et des listes de tags est instantanément mis à jour en fonction du critère de recherche. Le design a été réalisé avec Bootstrap et sa conception responsive assure une utilisation sur smartphone et tablette sans perte de qualité.','⚠️ les_petits_plats.png','slideshow','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p12ssee-al-2301','SportSee','SportSee propose un tableau de bord graphique d’analyse de performance à des utilisateurs recourant au coaching sportif. Les données extraites du back-End via une API, sont restituées sous-formes de graphiques en utilisant React et la bibliothèque Recharts. La page utilisateur se compose de 4 graphiques,  2 d’entre eux retracent un historique et disposent de tooltips animés. 4 cartes de données clés viennent complètent les graphiques. Pour faciliter l’appropration du code, celui-ci est entièrement documenté.','⚠️ sport_see.png','slideshow','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p11kasa-al-2212','Kasa','L’application web Kasa s’adresse aux particuliers désireux de louer leurs appartements. Développée avec React, elle propose des composants évolués tels que des cartes pour afficher un apperçu des locations, des collapses pour dérouler ou masquer des informations, un slider pour faire défiler les photos des appartements. Elle dispose d’une page d’accueil, d’une page appartement dont le contenu est créé dynamiquement, d’une page à propos et d’une page d’erreur. La navigation est confiée à React Router.','⚠️ kasa.png','slideshow','b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.project_deliverables (id,"path",project_id,account_id,user_id) VALUES
	 ('5067ca62-4c14-431d-972a-3e580a1fce45'::uuid,'/P6FEYE-al-2207.git','P6FEYE-al-2207','b2ad7f52-06db-4378-ae6a-ee789e8271de'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('5b394162-0991-4797-b413-319be4e3c441'::uuid,'/P6FEYE-al-2207','P6FEYE-al-2207','0aa97592-e9ae-43d4-b85e-3241f14d7187'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('65c27a2d-15c4-476e-8cdb-ce2c4e914132'::uuid,'/p7LPPA-al-2208.git','p7LPPA-al-2208','b2ad7f52-06db-4378-ae6a-ee789e8271de'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('ddb2ae6e-6597-4da7-afb9-82eccb8f6b6e'::uuid,'/p7LPPA-al-2208','p7LPPA-al-2208','0aa97592-e9ae-43d4-b85e-3241f14d7187'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('f59ff21f-094f-43a8-8793-cf384d036eb6'::uuid,'/p7LPPA-al-2208.pdf','p7LPPA-al-2208','22f596b1-ee5c-4274-b24b-b60193d61592'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('76399741-6e14-4042-a3a8-2af5ae70f4bb'::uuid,'/p12ssee-al-2301.git','p12ssee-al-2301','b2ad7f52-06db-4378-ae6a-ee789e8271de'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('852b4c4c-4ca5-4117-aa3b-8249ac7f4181'::uuid,'/p12ssee-al-2301','p12ssee-al-2301','0aa97592-e9ae-43d4-b85e-3241f14d7187'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('6120da1f-a545-4ebd-90d3-e26af5fef00b'::uuid,'/p11kasa-al-2212.git','p11kasa-al-2212','b2ad7f52-06db-4378-ae6a-ee789e8271de'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('dd9bb243-918e-4682-87b3-6afdd6767d33'::uuid,'/p11kasa-al-2212','p11kasa-al-2212','0aa97592-e9ae-43d4-b85e-3241f14d7187'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('622c4b17-ea8d-40fb-a2e9-2205d36a86bb'::uuid,'/P3OHMY-al-2205.git','P3OHMY-al-2205','b2ad7f52-06db-4378-ae6a-ee789e8271de'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.project_deliverables (id,"path",project_id,account_id,user_id) VALUES
	 ('acb48d2e-b8ee-4b61-a9f3-645041657ace'::uuid,'/P3OHMY-al-2205','P3OHMY-al-2205','0aa97592-e9ae-43d4-b85e-3241f14d7187'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('20047745-51e3-48db-aeae-a20d4dcae105'::uuid,'/P4GAME-al-2206.git','P4GAME-al-2206','b2ad7f52-06db-4378-ae6a-ee789e8271de'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('1ae6515d-22e4-4774-98aa-74112947e91b'::uuid,'/P4GAME-al-2206/P4GAME-al-2206/starterOnly','P4GAME-al-2206','0aa97592-e9ae-43d4-b85e-3241f14d7187'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('021afa6e-7067-45d3-9aab-da343e302265'::uuid,'/P9BILD-al-2211.git','P9BILD-al-2211','b2ad7f52-06db-4378-ae6a-ee789e8271de'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('05c327fd-5b93-4884-b33c-f5dc11f4db7b'::uuid,'/p13agba-al-2302.git','p13agba-al-2302','b2ad7f52-06db-4378-ae6a-ee789e8271de'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('843f6b70-be1c-48ef-9e97-ace0e6a1d8c5'::uuid,'/p13agba-al-2302','p13agba-al-2302','0aa97592-e9ae-43d4-b85e-3241f14d7187'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('ad9b656d-6119-49b4-8ba1-e54cce9d8948'::uuid,'/p14hnet-al-2303.git','p14hnet-al-2303','b2ad7f52-06db-4378-ae6a-ee789e8271de'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('f72ed80b-cbf6-4273-9322-48cf3d32a603'::uuid,'/package/react-data-table-plugin','p14hnet-al-2303','f015fe8c-3ea9-4a31-91cc-40369d26941f'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('cd107b7f-3a6f-4a8a-8401-f5be1e676f8f'::uuid,'/p14hnet-al-2303','p14hnet-al-2303','0aa97592-e9ae-43d4-b85e-3241f14d7187'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('2086f485-f3c8-4c6b-9385-f82cb2678da3'::uuid,'/sasu-al-2307.git','sasu-al-2307','b2ad7f52-06db-4378-ae6a-ee789e8271de'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.project_deliverables (id,"path",project_id,account_id,user_id) VALUES
	 ('7d97a1a4-123f-44bd-b454-9c45e32ba596'::uuid,'proto/iuQIgI40PZUozLlJJZ4Cmc/projet-perso?node-id=184-311&starting-point-node-id=184%3A311&mode=design&t=rqiilvM4FnYrwwf4-1','sasu-al-2307','38f539e1-bac4-4c4b-b439-03d42870d229'::uuid,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.project_techno (project_id,techno_id,user_id) VALUES
	 ('P3OHMY-al-2205',1,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P3OHMY-al-2205',14,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P3OHMY-al-2205',15,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P3OHMY-al-2205',7,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P3OHMY-al-2205',5,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P4GAME-al-2206',1,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P4GAME-al-2206',3,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P4GAME-al-2206',4,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P4GAME-al-2206',5,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P6FEYE-al-2207',1,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.project_techno (project_id,techno_id,user_id) VALUES
	 ('P6FEYE-al-2207',2,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P6FEYE-al-2207',3,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P6FEYE-al-2207',4,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P6FEYE-al-2207',5,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P9BILD-al-2211',3,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P9BILD-al-2211',16,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P9BILD-al-2211',17,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('P9BILD-al-2211',5,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p11kasa-al-2212',8,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p11kasa-al-2212',13,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.project_techno (project_id,techno_id,user_id) VALUES
	 ('p11kasa-al-2212',11,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p11kasa-al-2212',7,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p11kasa-al-2212',5,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p12ssee-al-2301',8,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p12ssee-al-2301',9,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p12ssee-al-2301',10,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p12ssee-al-2301',11,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p12ssee-al-2301',5,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p12ssee-al-2301',12,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p13agba-al-2302',8,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.project_techno (project_id,techno_id,user_id) VALUES
	 ('p13agba-al-2302',13,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p13agba-al-2302',18,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p13agba-al-2302',10,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p13agba-al-2302',11,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p13agba-al-2302',5,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p14hnet-al-2303',8,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p14hnet-al-2303',19,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p14hnet-al-2303',11,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p14hnet-al-2303',5,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p7LPPA-al-2208',1,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.project_techno (project_id,techno_id,user_id) VALUES
	 ('p7LPPA-al-2208',3,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p7LPPA-al-2208',4,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p7LPPA-al-2208',6,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p7LPPA-al-2208',7,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('p7LPPA-al-2208',5,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('sasu-al-2307',8,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('sasu-al-2307',20,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('sasu-al-2307',11,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('sasu-al-2307',21,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('sasu-al-2307',5,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.project_techno (project_id,techno_id,user_id) VALUES
	 ('sasu-al-2307',22,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid),
	 ('sasu-al-2307',23,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid);
INSERT INTO public.ref_anchor (anchor) VALUES
	 ('home'),
	 ('about'),
	 ('work');
INSERT INTO public.ref_tag (tag) VALUES
	 ('b'),
	 ('br'),
	 ('h1'),
	 ('h2'),
	 ('h3'),
	 ('input'),
	 ('p'),
	 ('textarea'),
	 ('Card'),
	 ('SkillsCloud');
INSERT INTO public.ref_tag (tag) VALUES
	 ('Slideshow');
INSERT INTO public.ref_techno ("name") VALUES
	 ('accessibilité'),
	 ('JavaScript'),
	 ('CSS'),
	 ('GitHub'),
	 ('HTML'),
	 ('Bootstrap'),
	 ('Responsive design'),
	 ('React'),
	 ('Recharts'),
	 ('API REST');
INSERT INTO public.ref_techno ("name") VALUES
	 (' Modules CSS'),
	 ('JSDoc'),
	 ('React Router'),
	 ('Animations CSS'),
	 (' Sass'),
	 ('Jest'),
	 ('Testing Library'),
	 ('Redux'),
	 ('plugin npm'),
	 ('TypeScript');
INSERT INTO public.ref_techno ("name") VALUES
	 ('Figma'),
	 ('Supabase'),
	 ('Vercel');
INSERT INTO public.showcase_sections (id,anchor_id,user_id,title) VALUES
	 ('0d04a950-8a77-4d4c-9d9b-7492ed9568cb'::uuid,1,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,NULL),
	 ('7540567d-0fa6-49a2-a2fd-6a634cf0c784'::uuid,2,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'À propos d''AlgoNetDesign'),
	 ('10126a4d-f5bf-4d5e-9433-8a67ffeea5e9'::uuid,3,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'Principales réalisations'),
	 ('d84e0691-528b-4f7e-b507-6efca345ff46'::uuid,NULL,'b48bc58a-dca6-4bcc-9f9d-5c33bc59003e'::uuid,'Autres réalisations');
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
