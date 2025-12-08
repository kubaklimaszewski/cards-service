INSERT INTO packs (name, price, description, rarity, icon, cards_count) VALUES 
    ('Basic Pack', 100, 'Opisowy opis', 'common', '&#x1F4E6;', 5),
    ('50/50 Pack', 2000, 'Win or shit', 'mythic', '&#x1F409;', 1),
    ('Bird Pack', 250, 'Znbieraj karty ptaków', 'rare', '&#x1F424;', 3);

INSERT INTO cards (name, value, description, rarity, icon) VALUES
    ('Shit', 1, 'Jebać opisy', 'common', '&#x1f4a9;'),
    ('Dragon', 3200, 'Jebać opisy v2', 'mythic', '&#x1f409;');

INSERT INTO packs_cards (pack_id, card_id, drop_weight) VALUES 
    (2, 1, 1),
    (2, 2, 1);