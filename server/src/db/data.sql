INSERT INTO packs (name, price, description, rarity, icon, cards_count) VALUES 
    ('Basic Pack', 100, 'Opisowy opis', 'common', '0x1F4E6', 5),
    ('Bird Pack', 250, 'Zbieraj karty ptaków', 'rare', '0x1F424', 3),
    ('50/50 Pack', 2000, 'Win or shit', 'mythic', '0x1F409', 1);

INSERT INTO cards (name, value, description, rarity, icon) VALUES
    ('Shit', 1, 'Jebać opisy', 'common', '0x1f4a9'),
    ('Dragon', 3200, 'Jebać opisy v2', 'mythic', '0x1f409');

INSERT INTO packs_cards (pack_id, card_id, drop_weight) VALUES 
    (3, 1, 1),
    (3, 2, 1);