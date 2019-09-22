module.exports = function Auto_Dueler(mod) {

    let enabled = true;
    let duelist_1 = 'username1';   // Duel Partner #1
    let duelist_2 = 'username2';  // Duel Partner #2
    let partner = '';
    let partner_id = null;
    let start = true;

    mod.game.on('enter_game', () => {
        enabled = false;
        if (mod.game.me.name === duelist_1) {
					partner = duelist_2.toLowerCase();
				}
        else if (mod.game.me.name === duelist_2) {
					partner = duelist_1.toLowerCase();
				}
    });

    mod.hook('S_REQUEST_CONTRACT', 1, (event) => {
        if (enabled) {
            if (event.senderName.toLowerCase() === partner) {
                start = true;
                partner_id = event.senderId;
                mod.send('C_ACCEPT_CONTRACT', 1, {
                    type: event.type,
                    id: event.id
                });
                return false;
            }
            if (event.recipientName.toLowerCase() === partner) {
                start = false;
                partner_id = event.recipientId;
                return false;
            }
        }
    });

    mod.hook('S_CHANGE_RELATION', 1, (event) => {
        if (enabled && partner_id === event.target) {
            if (event.relation === 5 && !start) {
                mod.send('C_DUEL_CANCEL', 1);
                mod.send('C_LEAVE_GROUP_DUEL', 1);
            }
        }
    });

    mod.hook('S_DUEL_END', 1, (event) => {
        if (enabled && start) {
            mod.send('C_REQUEST_CONTRACT', 1, {
                type: 11,
                unk2: 0,
                unk3: 0,
                unk4: 0,
                name: partner
            });
        }
    });

    mod.command.add('duel', (param) => {
        if (param === null) {
            enabled = !enabled;
            if (enabled) {
                if (mod.game.me.name === duelist_1) {
									mod.command.message('[Dueler] It\'s time to d-d-d-d-d-d-d-duel ' + duelist_2 + '!')
								}
                else if (mod.game.me.name === duelist_2) {
									mod.command.message('[Dueler] It\'s time to d-d-d-d-d-d-d-duel ' + duelist_1 + '!')
								}
                mod.send('C_REQUEST_CONTRACT', 1, {
                    type: 11,
                    unk2: 0,
                    unk3: 0,
                    unk4: 0,
                    name: partner
                });
            }
            else mod.command.message('[Dueler] Stopping duels with ' + partner + '.');
        }
        else {
            partner = param;
            mod.command.message('[Dueler] Dueling partner is now ' + partner + '.');
        }
    });
};
