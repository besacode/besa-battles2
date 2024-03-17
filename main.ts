namespace SpriteKind {
    export const Coin = SpriteKind.create()
    export const Bomb = SpriteKind.create()
    export const StoreItem = SpriteKind.create()
    export const HUD = SpriteKind.create()
    export const Exit = SpriteKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentScreen == SCR_MENU) {
        menuIdx += -1
        if (menuIdx < 0) {
            menuIdx = menuOptions.length - 1
        }
        drawMenu()
    }
})
function getStoreItem (itemName: string) {
    if (itemName == "AXE") {
        if (playerHasWeapon("AXE")) {
            storeItemSprite = sprites.create(assets.image`axe-purchased`, SpriteKind.StoreItem)
        } else {
            storeItemSprite = sprites.create(assets.image`axe-for sale`, SpriteKind.StoreItem)
            sprites.setDataNumber(storeItemSprite, "cost", 10)
            sprites.setDataString(storeItemSprite, "shopName", "axe")
            sprites.setDataString(storeItemSprite, "weaponName", "AXE")
            sprites.setDataBoolean(storeItemSprite, "available", true)
        }
    } else if (itemName == "BIG BOMB") {
        if (playerHasWeapon("BIG BOMB")) {
            storeItemSprite = sprites.create(img`
                . . . . . 5 e e . . . . . . . . 
                . . . . . . . e . . . . . . . . 
                . . . . . . . e . . . . . . . . 
                . . . . f f f f f f f . . . . . 
                . . . f f f f f f f f f . . . . 
                . . f f f f f f f f f f f . . . 
                . f f f f f f f f f f f f f . . 
                . f f f f f f f f f f f f f . . 
                . f f f f f f f f f f f f f . . 
                . f f f f f f f f f f f f f . . 
                . f f f f f f f f f f f f f . . 
                . f f f f f f f f f f f f f . . 
                . f f f f f f f f f f f f f . . 
                . . f f f f f f f f f f f . . . 
                . . . f f f f f f f f f . . . . 
                . . . . f f f f f f f . . . . . 
                `, SpriteKind.StoreItem)
        } else {
            storeItemSprite = sprites.create(img`
                7 7 7 7 7 5 e e 7 7 7 7 7 7 7 7 
                7 7 7 7 7 7 7 e 7 7 7 7 7 7 7 7 
                7 7 7 7 7 7 7 e 7 7 7 7 7 7 7 7 
                7 7 7 7 f f f f f f f 7 7 7 7 7 
                7 7 7 f f f f f f f f f 7 7 7 7 
                7 7 f f f f f f f f f f f 7 7 7 
                7 f f f f f f f f f f f f f 7 7 
                7 f f f f f f f f f f f f f 7 7 
                7 f f f f f f f f f f f f f 7 7 
                7 f f f f f f f f f f f f f 7 7 
                7 f f f f f f f f f f f f f 7 7 
                7 f f f f f f f f f f f f f 7 7 
                7 f f f f f f f f f f f f f 7 7 
                7 7 f f f f f f f f f f f 7 7 7 
                7 7 7 f f f f f f f f f 7 7 7 7 
                7 7 7 7 f f f f f f f 7 7 7 7 7 
                `, SpriteKind.StoreItem)
            sprites.setDataNumber(storeItemSprite, "cost", 8)
            sprites.setDataString(storeItemSprite, "shopName", "big bombs")
            sprites.setDataString(storeItemSprite, "weaponName", "BIG BOMB")
            sprites.setDataBoolean(storeItemSprite, "available", true)
        }
    } else if (itemName == "5HEARTS") {
        if (playerHasItem("5HEARTS")) {
            storeItemSprite = sprites.create(assets.image`hearts-purchased`, SpriteKind.StoreItem)
        } else {
            storeItemSprite = sprites.create(assets.image`5hearts`, SpriteKind.StoreItem)
            sprites.setDataNumber(storeItemSprite, "cost", 10)
            sprites.setDataString(storeItemSprite, "shopName", "5 hearts")
            sprites.setDataString(storeItemSprite, "itemName", "5HEARTS")
            sprites.setDataBoolean(storeItemSprite, "available", true)
        }
    } else if (itemName == "10HEARTS") {
        if (playerHasItem("10HEARTS")) {
            storeItemSprite = sprites.create(assets.image`hearts-purchased`, SpriteKind.StoreItem)
        } else {
            storeItemSprite = sprites.create(assets.image`10hearts`, SpriteKind.StoreItem)
            sprites.setDataNumber(storeItemSprite, "cost", 20)
            sprites.setDataString(storeItemSprite, "shopName", "10 hearts")
            sprites.setDataString(storeItemSprite, "itemName", "10HEARTS")
            sprites.setDataBoolean(storeItemSprite, "available", true)
        }
    } else {
        game.splash("unknown store item: " + itemName)
    }
    return storeItemSprite
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Coin, function (sprite, otherSprite) {
    getCoins(1)
    tileStatus[otherSprite.tilemapLocation().row * tilemapCols + otherSprite.tilemapLocation().column] = 1
    otherSprite.destroy(effects.bubbles, 500)
})
function loadMaze () {
    tiles.setTilemap(tilemap`baseMap`)
    if (mapCells.length == 0) {
        createMaze()
        if (player_dmg_mult != 1 && player_dmg_mult_next == 1) {
            music.powerDown.play()
        }
        player_dmg_mult = player_dmg_mult_next
        player_dmg_mult_next = 1
    } else {
        for (let tmpRowNum = 0; tmpRowNum <= tilemapRows - 1; tmpRowNum++) {
            for (let tmpColNum = 0; tmpColNum <= tilemapCols - 1; tmpColNum++) {
                tiles.setTileAt(tiles.getTileLocation(tmpColNum, tmpRowNum), mapCells[tmpRowNum * tilemapCols + tmpColNum])
            }
        }
    }
    for (let value6 of tiles.getTilesByType(assets.tile`baseTile`)) {
        tiles.setWallAt(value6, true)
    }
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentScreen == SCR_BATTLE) {
        player_weapon_index += 1
        if (player_weapon_index >= player_weapons.length) {
            player_weapon_index = 0
        }
        loadWeapon()
        drawArena()
    } else if (currentScreen == SCR_CHOOSECLASS) {
        gameNum = game.askForNumber("Enter game #")
        if (!(gameNum)) {
            gameNum = randint(1, 999999)
        }
        chooseClass()
    } else {
        showStatus()
    }
})
function playerHasItem (itemName: string) {
    return 0 <= player_items.indexOf(itemName)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentScreen == SCR_BATTLE) {
        doBattle()
    } else if (currentScreen == SCR_CHOOSECLASS) {
        finishChooseclass()
    } else if (currentScreen == SCR_MENU) {
        finishMenu(menuOptions[menuIdx])
    } else {
        for (let value of sprites.allOfKind(SpriteKind.StoreItem)) {
            if (playerSprite.overlapsWith(value)) {
                vendItemSprite(value)
            }
        }
    }
})
function initMap () {
    info.setLife(player_max_life)
    scene.setBackgroundColor(13)
    clearSprites()
    loadMaze()
    loadClass()
    currentScreen = SCR_MAP
    levelMonsterCount = 0
    playerSprite.setPosition(player_x, player_y)
    controller.moveSprite(playerSprite, 100, 100)
    scene.cameraFollowSprite(playerSprite)
    for (let hole_tile of tiles.getTilesByType(assets.tile`holeTile`)) {
        tiles.setTileAt(hole_tile, sprites.castle.tilePath5)
        placeSpriteImage(assets.image`holeImg`, [hole_tile], false)
    }
    if (levelSeed == 0) {
        levelSeed = randomSeed
    } else {
        tmpRandom = randomSeed
        randomSeed = levelSeed
    }
    for (let powerup_tile of tiles.getTilesByType(assets.tile`Coin0`)) {
        tiles.setTileAt(powerup_tile, sprites.castle.tilePath5)
        placeSpriteImage(myPickRandom(powerupList), [powerup_tile], false)
    }
    for (let monster_start2 of tiles.getTilesByType(assets.tile`mon1Tile`)) {
        tiles.setTileAt(monster_start2, sprites.castle.tilePath5)
        placeSpriteImage(myPickRandom(monsterList), [monster_start2], true)
    }
    for (let monster_start3 of tiles.getTilesByType(assets.tile`mon2Tile`)) {
        tiles.setTileAt(monster_start3, sprites.castle.tilePath5)
        placeSpriteImage(myPickRandom(monsterListLvl2), [monster_start3], true)
    }
    randomSeed = tmpRandom
    for (let monster_start4 of tiles.getTilesByType(assets.tile`bossTile`)) {
        tiles.setTileAt(monster_start4, sprites.castle.tilePath5)
        placeSpriteImage(boss_monster_image, [monster_start4], false)
    }
    fillStores()
    playerSprite.z = 99
}
function getMonster (monsterImage: Image) {
    monster_reward = 1
    monster_image = monsterImage
    if (monsterImage.equals(assets.image`the angry person`)) {
        monster_name = "angry person"
        monster_life = 4
        monster_reward = 2
        monster_dmg_max = 2
    } else if (monsterImage.equals(img`
        . . . . . b b b . . . . . . . . 
        . . . . b 2 2 2 b b . . . . . . 
        . . . . b 2 2 2 2 2 b . . . . . 
        . . . b 2 1 2 2 2 2 2 b . . . . 
        . . . b 2 2 2 2 2 2 2 2 b . . . 
        . . b 2 2 2 2 2 2 1 1 2 b . . . 
        . . b 2 2 2 2 2 2 1 1 2 2 b . . 
        . b 2 2 1 1 2 2 2 2 2 2 2 b . . 
        . b 2 2 1 1 2 2 2 2 2 b b . . . 
        . b 2 2 2 2 2 2 b b b e . . . . 
        . . b b b b b b c c c e . . . . 
        . . . . e c c c c c c e . . . . 
        . . . . e c c c c c c b . . . . 
        . . . . e c c c c c c b . . . . 
        . . . . . b c c c c b . . . . . 
        . . . . . . b b b b . . . . . . 
        `)) {
        monster_name = "poisonous mushroom"
        monster_life = 2
        monster_dmg_max = 1
    } else if (monsterImage.equals(assets.image`purple monster`)) {
        monster_name = "purple monster"
        monster_life = 3
        monster_dmg_max = 2
    } else if (monsterImage.equals(assets.image`Reaper`)) {
        monster_name = "Reaper"
        monster_life = 7
        monster_reward = 3
        monster_dmg_max = 3
    } else if (monsterImage.equals(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . f f f . . 
        . . . . . . . . . . f d f d f . 
        . . . . . . . . . . f d d d f . 
        . . . . . . . . . . . f f f . . 
        . . . . . . . . . . . . . f . . 
        . . . . . . . . . . . . f f f . 
        . . . . 3 3 3 3 . . . f . f . f 
        . . 3 3 f 3 3 f 3 . . . . f . . 
        . . 3 3 3 3 3 3 3 . . . . f . . 
        3 3 3 3 3 3 3 3 3 3 3 . f . f . 
        3 3 3 3 3 3 3 3 3 3 3 f . . . f 
        `)) {
        monster_name = "blob & cyclops"
        monster_reward = 2
        monster_life = 10
        monster_dmg_max = 3
    } else if (monsterImage.equals(img`
        . 8 8 8 8 8 . . . . . 8 8 . . . 
        . 8 1 4 1 8 . . . . 8 1 3 8 . . 
        . 8 4 4 4 8 . . . 8 8 3 3 8 . . 
        . 8 8 8 8 8 . . . . 8 8 3 8 . . 
        . . 8 8 8 . . . . . . 8 8 8 . . 
        . 8 8 8 8 8 . . . . 8 8 8 8 8 . 
        . 8 . 8 . 8 . . . . 8 . 8 . 8 . 
        . . . 8 . . . . . . . . 8 . . . 
        . . . 8 . . . . . . . . 8 . . . 
        . . . 8 . . . . . . . . 8 . . . 
        . . . 8 8 . . . . . . . 8 8 . . 
        . . . 8 8 . . . . . . . 8 8 . . 
        . . 8 8 . 8 . . . . . 8 . . 8 . 
        . . 8 . . 8 . . . . . 8 . . 8 . 
        . 8 . . . 8 . . . . 8 . . . 8 . 
        . . . . . . . . . . . . . . . . 
        `)) {
        monster_name = "two blue monsters"
        monster_reward = 3
        monster_life = 12
        monster_dmg_max = 4
    } else if (monsterImage.equals(img`
        . 2 2 2 2 2 . . . . . 2 2 . . . 
        . 2 1 4 1 2 . . . . 2 1 3 2 . . 
        . 2 4 4 4 2 . . . 2 2 3 3 2 . . 
        . 2 2 2 2 2 . . . . 2 2 3 2 . . 
        . . 2 2 2 . . . . . . 2 2 2 . . 
        . 2 2 2 2 2 . . . . 2 2 2 2 2 . 
        . 2 . 2 . 2 . . . . 2 . 2 . 2 . 
        . . . 2 . . . . . . . . 2 . . . 
        . . . 2 . . . . . . . . 2 . . . 
        . . . 2 . . . . . . . . 2 . . . 
        . . . 2 2 . . . . . . . 2 2 . . 
        . . . 2 2 . . . . . . . 2 2 . . 
        . . 2 2 . 2 . . . . . 2 . . 2 . 
        . . 2 . . 2 . . . . . 2 . . 2 . 
        . 2 . . . 2 . . . . 2 . . . 2 . 
        . . . . . . . . . . . . . . . . 
        `)) {
        monster_name = "two red monsters"
        monster_reward = 4
        monster_life = 14
        monster_dmg_max = 4
    } else if (monsterImage.equals(assets.image`aKarenMonster`)) {
        monster_name = "A Karen"
        monster_life = 19
        monster_reward = 6
        monster_dmg_max = 5
    } else if (monsterImage.equals(assets.image`Evil Sorcerer`)) {
        monster_name = "Evil Sorcerer"
        monster_life = 25
        monster_dmg_max = 8
    } else {
        monster_name = "unknown monster"
        monster_life = 2
        monster_dmg_max = 2
    }
}
function loadWeapon () {
    player_attack_name = player_weapons[player_weapon_index]
    if (player_attack_name == "SMALL BOMB") {
        player_min_damage = 1
        player_max_damage = 1
    } else if (player_attack_name == "SWORD") {
        player_min_damage = 0
        player_max_damage = 2
    } else if (player_attack_name == "BIG BOMB") {
        player_min_damage = 2
        player_max_damage = 4
    } else if (player_attack_name == "AXE") {
        player_min_damage = 0
        player_max_damage = 5
    } else {
        game.splash("no weapon loaded")
        player_max_damage = 0
        player_min_damage = 0
    }
}
function clearSprites () {
    for (let spriteKind of [
    SpriteKind.Player,
    SpriteKind.Coin,
    SpriteKind.Enemy,
    SpriteKind.Bomb,
    SpriteKind.Exit,
    SpriteKind.Text,
    SpriteKind.StoreItem,
    SpriteKind.HUD
    ]) {
        for (let value2 of sprites.allOfKind(spriteKind)) {
            value2.destroy()
        }
    }
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentScreen == SCR_CHOOSECLASS) {
        classChoiceIndex += -1
        if (classChoiceIndex < 0) {
            classChoiceIndex = available_classes.length - 1
        }
        loadClass()
    }
})
function getCoins (num: number) {
    if (num > 1) {
        for (let index = 0; index < num - 1; index++) {
            info.changeScoreBy(1)
            music.baDing.playUntilDone()
        }
    }
    info.changeScoreBy(1)
    music.baDing.play()
}
function showSplashScreen () {
    textSprite = textsprite.create("BESA", 0, 2)
    textSprite.setMaxFontHeight(20)
    textSprite.setOutline(1, 14)
    textSprite.setPosition(textSprite.width / 2, 5 + textSprite.height / 2)
    tmpSpriteY = 10 + textSprite.height
    textSprite2 = textsprite.create("Battles", 0, 9)
    textSprite2.setMaxFontHeight(20)
    textSprite2.setOutline(1, 14)
    textSprite2.setPosition(textSprite2.width / 2 + 0, tmpSpriteY + textSprite2.height / 2)
    tmpSpriteY += textSprite2.height + 5
    textSprite3 = textsprite.create("created by: ")
    textSprite3.setPosition(textSprite3.width / 2, tmpSpriteY + textSprite3.height / 2)
    tmpSpriteX = textSprite3.width
    textSprite3 = textsprite.create("Benji", 0, 13)
    textSprite3.setPosition(tmpSpriteX + textSprite3.width / 2, tmpSpriteY + textSprite3.height / 2)
    tmpSpriteY += textSprite3.height + 2
    tmpSpriteX = 71
    textSprite4 = textsprite.create("Sagan", 0, 7)
    textSprite4.setPosition(tmpSpriteX + textSprite4.width / 2, tmpSpriteY + textSprite4.height / 2)
    tmpSpriteX += textSprite4.width
    textSprite4 = textsprite.create(" and ")
    textSprite4.setPosition(tmpSpriteX + textSprite4.width / 2, tmpSpriteY + textSprite4.height / 2)
    tmpSpriteX += textSprite4.width
    textSprite4 = textsprite.create("Ada", 0, 10)
    textSprite4.setPosition(tmpSpriteX + textSprite4.width / 2, tmpSpriteY + textSprite4.height / 2)
    textSprite5 = textsprite.create("" + betaBattlesVersion)
    textSprite5.setPosition(30 + textSprite.width, textSprite.height)
    sprites.create(assets.image`redAButton`, SpriteKind.HUD).setPosition(scene.screenWidth() - 16, scene.screenHeight() - 16)
    sprites.create(assets.image`yellowBButton`, SpriteKind.HUD).setPosition(scene.screenWidth() - 48, scene.screenHeight() - 16)
}
function createMaze () {
    levelNum = levelNum + 1
    randomSeed = gameNum * 1031 * levelNum
    levelSeed = 0
    mapCells = []
    tileStatus = []
    tilemapCols = 16
    tilemapRows = 16
    player_x = 136
    player_y = 136
    dirsDone = 0
    for (let initialDir of [0, 1, 2]) {
        direction = initialDir
        tilemapX = Math.round(tilemapCols / 2)
        tilemapY = Math.round(tilemapRows / 2)
        player_x = tilemapX * 16 + 8
        player_y = tilemapY * 16 + 8
        mapgenDone = 0
        while (true) {
            if (!(mapCells[tilemapY * tilemapCols + tilemapX])) {
                if (myRandInt(1, 100) <= 10) {
                    if (3 <= levelNum && (6 < levelNum || 5 < myRandInt(levelNum, 6))) {
                        tmpTileMapCell = assets.tile`mon2Tile`
                    } else {
                        tmpTileMapCell = assets.tile`mon1Tile`
                    }
                } else if (myRandInt(1, 100) <= 5) {
                    tmpTileMapCell = assets.tile`Coin0`
                } else if (5 <= levelNum && myRandInt(1, 100) <= levelNum - 4) {
                    tmpTileMapCell = assets.tile`bossTile`
                } else {
                    tmpTileMapCell = sprites.castle.tilePath5
                }
                if (tilemapX <= 0 || (tilemapX >= tilemapCols - 1 || (tilemapY <= 0 || tilemapY >= tilemapRows - 1))) {
                    mapgenDone = 1
                    dirsDone += 1
                    if (dirsDone == 1) {
                        tmpTileMapCell = assets.tile`store0`
                    } else if (dirsDone == 2) {
                        tmpTileMapCell = assets.tile`store1`
                    } else if (dirsDone == 3) {
                        tmpTileMapCell = assets.tile`holeTile`
                    }
                }
                tiles.setTileAt(tiles.getTileLocation(tilemapX, tilemapY), tmpTileMapCell)
                tiles.setWallAt(tiles.getTileLocation(tilemapX, tilemapY), false)
                mapCells[tilemapY * tilemapCols + tilemapX] = tmpTileMapCell
            }
            if (mapgenDone) {
                break;
            }
            if (direction == 0) {
                dx = 0
                dy = -1
            } else if (direction == 1) {
                dx = 1
                dy = 0
            } else if (direction == 2) {
                dx = 0
                dy = 1
            } else if (direction == 3) {
                dx = -1
                dy = 0
            } else {
                game.splash("bad direction: " + direction)
            }
            tilemapY += dy
            tilemapX += dx
            direction = myRandInt(0, 3)
        }
    }
    for (let i = 0; i <= tilemapCols * tilemapRows - 1; i++) {
        tileStatus[i] = 0
    }
}
function showStatus () {
    tempStr = "Game# " + gameNum + "\\nLevel " + levelNum + "\\n"
    tempStr = "" + tempStr + player_class_name + " " + player_level + "\\n"
    tempStr = "" + tempStr + info.score() + " coins\\n"
    if (player_class_name == "DEMOLITIONIST") {
        tempStr = "" + tempStr + player_bombs + " big bombs\\n"
    }
    tempStr = "" + tempStr + "--Weapons--\\n"
    for (let value3 of player_weapons) {
        tempStr = "" + tempStr + "- " + value3 + "\\n"
    }
    if (player_dmg_mult != 1) {
        tempStr = "" + tempStr + "Dmg mult: " + player_dmg_mult + "x"
        if (player_dmg_mult_next != 1) {
            tempStr = "" + tempStr + "+"
        }
        tempStr = "" + tempStr + "\\n"
    }
    tempStr = "" + tempStr + "BESA Battles " + betaBattlesVersion
    game.showLongText(tempStr, DialogLayout.Center)
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentScreen == SCR_CHOOSECLASS) {
        classChoiceIndex += 1
        if (classChoiceIndex >= available_classes.length) {
            classChoiceIndex = 0
        }
        loadClass()
    }
})
function menuDialog () {
    tmpCurScreen = currentScreen
    currentScreen = SCR_MENU
    menuIdx = 0
    drawMenu()
}
function doGameOver () {
    menuOptions = []
    menuOptions.push("retry")
    if (info.score() > 5) {
        contLevel = Math.min(Math.floor(info.score() / 5), levelNum)
        menuOptions.push("continue at level " + contLevel)
    }
    menuOptions.push("quit")
    menuTitle = "Game Over"
    menuDialog()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Bomb, function (sprite, otherSprite) {
    music.powerUp.play()
    player_bombs += 1
    tileStatus[otherSprite.tilemapLocation().row * tilemapCols + otherSprite.tilemapLocation().column] = 1
    otherSprite.destroy(effects.rings, 500)
})
function initGame () {
    levelNum = 0
    mapCells = []
    player_max_life = 5
    player_bombs = 0
    player_weapon_index = 0
    player_dmg_mult = 1
    player_dmg_mult_next = 1
    player_level = 0
    player_level_progress = 0
    info.setScore(0)
}
function finishMenu (menuResult: string) {
    currentScreen = tmpCurScreen
    if (menuResult == "retry") {
        initGame()
        finishChooseclass()
    } else if (menuResult == "continue at level " + contLevel) {
        levelNum = contLevel - 1
        info.changeScoreBy(contLevel * -5)
        createMaze()
        initMap()
    } else {
        game.over(false, effects.melt)
    }
}
function playerHasWeapon (weaponName: string) {
    return 0 <= player_weapons.indexOf(weaponName)
}
function finishChooseclass () {
    currentScreen = SCR_MAP
    loadClass()
    initClass()
    initMap()
}
function vendItemSprite (mySprite: Sprite) {
    cost = sprites.readDataNumber(mySprite, "cost")
    shopName = sprites.readDataString(mySprite, "shopName")
    weaponName = sprites.readDataString(mySprite, "weaponName")
    itemName = sprites.readDataString(mySprite, "itemName")
    if (!(sprites.readDataBoolean(mySprite, "available"))) {
        return
    }
    if (cost > info.score()) {
        game.showLongText("The " + shopName + " costs " + cost, DialogLayout.Bottom)
    } else {
        if (game.ask("Buy the " + shopName + " for " + cost + "?")) {
            info.changeScoreBy(-1 * cost)
            tileStatus[mySprite.tilemapLocation().row * tilemapCols + mySprite.tilemapLocation().column] = 1
            if (!(weaponName.isEmpty())) {
                player_weapons.push(weaponName)
            }
            if (!(itemName.isEmpty())) {
                player_items.push(itemName)
                getItem(itemName)
            }
            music.powerUp.play()
            player_x = playerSprite.x
            player_y = playerSprite.y
            initMap()
        }
    }
}
function initClass () {
    player_weapons = []
    player_items = []
    store_items = []
    if (player_class_name == "WARRIOR") {
        player_weapons.push("SWORD")
        store_items.push("AXE")
    } else if (player_class_name == "DEMOLITIONIST") {
        player_weapons.push("SMALL BOMB")
        powerupList.push(assets.image`big bomb`)
        store_items.push("BIG BOMB")
    }
    store_items.push("5HEARTS")
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (currentScreen == SCR_MENU) {
        menuIdx += 1
        if (menuIdx >= menuOptions.length) {
            menuIdx = 0
        }
        drawMenu()
    }
})
function drawArena () {
    loadWeapon()
    clearSprites()
    tiles.setTilemap(tilemap`arenaTilemap`)
    scene.setBackgroundColor(13)
    for (let player_start of tiles.getTilesByType(assets.tile`myTile0`)) {
        tiles.setTileAt(player_start, sprites.builtin.brick)
        tiles.placeOnTile(sprites.create(playerSprite.image, SpriteKind.Player), player_start)
    }
    for (let monster_start5 of tiles.getTilesByType(assets.tile`mon1Tile`)) {
        tiles.setTileAt(monster_start5, sprites.builtin.brick)
        tiles.placeOnTile(sprites.create(monster_image, SpriteKind.Enemy), monster_start5)
    }
    pause(100)
    sprites.create(img`
        ..........333333333333..........
        ........3332222222222333........
        ......33322222222222222333......
        .....3322222222222222222233.....
        ....332222222222222222222233....
        ....322222222222222222222223....
        ...33222222222222222222222233...
        ...33222222222222222222222233...
        ...bb2222222222222222222222bb...
        ...bb2222222222222222222222bb...
        ...bba22222222222222222222abb...
        ...bba22222222222222222222abb...
        ...bbaa222222222222222222aabb...
        ...bb3aa2222222222222222aa3bb...
        ...ab23aaa222222222222aaa32ba...
        ..ccb2223aaaaaaaaaaaaaa3222bcc..
        .ccbc222223aaaaaaaaaa322222cbcc.
        .fcbcc22222222222222222222ccbcf.
        .fcbbcc222222222222222222ccbdcf.
        .fbbbbccc22222222222222cccbddcf.
        .fbcbbbbccccccccccccccccbdddbcf.
        .fbccbbbbbccccccccccccb111ddccf.
        .f3ccccbbbddddddddddddd111dcccf.
        .f3ccccccbbddddddddddddddbbcccf.
        .f3cccccccccccccbbbbbbbbbdbcccf.
        ..f3cccccccccbbbbbbbbbbbddbccf..
        ..f3cccccccccbbbbbbbbbbbddbccf..
        ..ff3ccccccccbbbbbbbbbbbddbcff..
        ...ff3cccccccbbbbbbbbbbbddbff...
        ....ffcccccccbbbbbbbbbbbdbff....
        ......ffccccbbbbbbbbbbbbff......
        ........ffffffffffffffff........
        `, SpriteKind.HUD).setPosition(8, 109)
    attackTextSprite = textsprite.create("" + player_attack_name + " attack")
    attackTextSprite.setOutline(1, 2)
    attackTextSprite.setPosition(63, 114)
    if (1 < player_weapons.length) {
        sprites.create(img`
            ..........333333333333..........
            ........3335555555555333........
            ......33355555555555555333......
            .....3355555555555555555533.....
            ....335555555555555555555533....
            ....355555555555555555555553....
            ...33555555555555555555555533...
            ...33555555555555555555555533...
            ...bb5555555555555555555555bb...
            ...bb5555555555555555555555bb...
            ...bbe55555555555555555555ebb...
            ...bbe55555555555555555555ebb...
            ...bbee555555555555555555eebb...
            ...bbbee5555555555555555eebbb...
            ...ab5beee555555555555eeeb5ba...
            ..ccb555beeeeeeeeeeeeeeb555bcc..
            .ccbc55555beeeeeeeeeeb55555cbcc.
            .fcbcc55555555555555555555ccbcf.
            .fcbbcc555555555555555555ccbdcf.
            .fbbbbccc55555555555555cccbddcf.
            .fbcbbbbccccccccccccccccbdddbcf.
            .fbccbbbbbccccccccccccb111ddccf.
            .f3ccccbbbddddddddddddd111dcccf.
            .f3ccccccbbddddddddddddddbbcccf.
            .f3cccccccccccccbbbbbbbbbdbcccf.
            ..f3cccccccccbbbbbbbbbbbddbccf..
            ..f3cccccccccbbbbbbbbbbbddbccf..
            ..ff3ccccccccbbbbbbbbbbbddbcff..
            ...ff3cccccccbbbbbbbbbbbddbff...
            ....ffcccccccbbbbbbbbbbbdbff....
            ......ffccccbbbbbbbbbbbbff......
            ........ffffffffffffffff........
            `, SpriteKind.HUD).setPosition(153, 109)
        textSprite2 = textsprite.create("change attack")
        textSprite2.setOutline(1, 14)
        textSprite.setBorder(1, 5)
        textSprite2.setPosition(96, 104)
    }
    monsterLifeTextSprite = textsprite.create("" + monster_name + " " + monster_life, 1, 8)
    monsterLifeTextSprite.setBorder(1, 8)
    monsterLifeTextSprite.setPosition(150 - monsterLifeTextSprite.width / 2, 5)
    if (player_dmg_mult != 1) {
        textSprite3 = textsprite.create("" + player_dmg_mult + "xDMG")
        textSprite3.setOutline(1, 2)
        textSprite3.setPosition(143, 87)
    }
    if (player_level > 0) {
        textSprite4 = textsprite.create("XP Bonus +" + player_level)
        textSprite4.setOutline(1, 6)
        textSprite4.setPosition(40, 87)
    }
}
function myPickRandom (list: Image[]) {
    return list[myRandInt(0, list.length - 1)]
}
function placeSpriteImage (spriteImage: Image, spriteLocation: tiles.Location[], isMonster: boolean) {
    if (tileStatus[spriteLocation[0].row * tilemapCols + spriteLocation[0].column] != 0) {
        return
    }
    newImage = spriteImage
    if (newImage.equals(assets.image`big bomb`)) {
        spriteKind2 = SpriteKind.Bomb
    } else if (newImage.equals(assets.image`coinImg`)) {
        spriteKind2 = SpriteKind.Coin
    } else if (newImage.equals(assets.image`holeImg`)) {
        spriteKind2 = SpriteKind.Exit
    } else {
        spriteKind2 = SpriteKind.Enemy
    }
    newSprite = sprites.create(newImage, spriteKind2)
    tiles.placeOnTile(newSprite, spriteLocation[0])
    if (playerSprite.overlapsWith(newSprite)) {
        newSprite.destroy()
    } else {
        if (isMonster) {
            levelMonsterCount += 1
        }
    }
}
function chooseClass () {
    currentScreen = SCR_CHOOSECLASS
    clearSprites()
    scene.setBackgroundImage(img`
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
        999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999d999999999999999999
        999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999d9999dd999999999999999999
        999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999dd999dd999999999999999999
        999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999dd99ddd999999999999999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999d999dddd9ddddd9999999999999999
        999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999ddd99dddd99dd999999999999999999
        999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999ddd999dd99dddddd999999999999999
        99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999dddd9ddddddddd999999999d99999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999ddd9dddd999dd99999999d99999999
        999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999ddd99ddddd99d99999999dddd999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999ddddddddddddd9d999999999d99999999
        99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999ddddddddddddddddd9999dddd9999999
        9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999d99999ddddd99ddddddddddddd999ddd9999999
        9999999999999999999999999999d99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999d9999dddddddddddddddddddddd99ddddd99999
        999999999999999999999999999dd999999d9999999999999999999999999999999999999999999999999999999999999999999999999999999999999dd99999dddddddddddddddddddddddddd999999
        999999999999999999999999999ddd99999d999999999999d999999999999999999999999999999999999999999999999999999999999999999999999dd9999dddddddddddddddddddddddddd9999999
        99999999999999999999999999ddddd9999dd9999999999ddd9999999999999999999999999999999999999999999999999999999999999999999999ddd9999dddddddddddddddddddddddddd9999999
        9999999999999999999999999ddddddd999dd9999999999ddd99999999999999999999999999999999999999999999999999999999999999999999999d9999dddddddddddddddddddddddddddd999999
        9999999999999999999999999d9dddd999ddd999999999ddddd999999999999999999999999999999999999999999999999999999999999999999999dddd99dddddddddddddddddddddddddddddd9999
        99999999999999999999999999ddddd999dddd99999999dddddd999999999999999999999999999999999999999999999999999999999999999999999dd99ddddddddddddddddddddddddddddddddd99
        9999999999999999999999999ddddddd999dd9999999999dddd999999999999999999999999999999999999999999999999999999999999999999ddddddddddddddddddddddddddddddddddddddddddd
        99999999999999999999999999dddd9dd99ddd9999999dddddd999999999999999999999999999999999999999999999999999999999999999999ddddddddddddddddddddddddddddddddddddddddddd
        9999999999999999999999999dddddd999ddd999999999dddddd9999999999999999999999999999999999999999999999999999999999999999dddddddddddddddddddddddddddddddddddddddddddd
        999999999999999999999999dd9ddddd99dddd9999999ddddd9dd99999999999999999999999999999999999999999999999999999d999999999dddddddddddddddddddddddddddddddddddddddddddd
        99999999999999999999999999dddddddddddd999999ddddddd999999999999999999999999999999999999999999999999999999dd99999999ddddddddddddddddddddddddddddddddddddddddddddd
        9999999999999999999999999ddddddddddddddddddd99dddddd99999999999999999999999999999999999999999999999999999ddd9999999ddddddddddddddddddddddddddddddddddddddddddddd
        9999999999999d9999999999ddddddddddddddddddddd99dddddd999999999999999999999999999999999999999999999999999ddddd99999dddddddddddddddddddddddddddddddddddddddddddddd
        999999999999ddd99999999999ddddddddddddddddddddddd999999999999999999999999999999999999999999999999999999ddddddd9999dddddddddddddddddddddddddddddddddddddddddddddd
        999999999999dd9999999999dddddddddddddddddddddddddd9999999999999999999999999999999999d999999999999999999d9dddd9999ddddddddddddddddddddddddddddddddddddddddddddddd
        99999999999ddd999999999dddddddddddddddddddddddddddd999999999999999999999999999999999dd999999999999999999ddddd9999ddddddddddddddddddddddddddddddddddddddddddddddd
        9999999999ddddd999999ddddddddddddddddddddddddddddddd99999999999999999999999999999999dd99999d99999999999ddddddd99dddddddddddddddddddddddddddddddddddddddddddddddd
        99999999999ddd99999dddddddddddddddddddddddddddddddddd999999999999999999999999999999dddd9999d9999999999ddddddd6666666666666666666666ddddddddddddddddddddddddddddd
        999999999999ddd999dddddddddddddddddddddddddddddddddddd99999999999999999999999999999dddd9999dd999999dddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        9999999999dddd99ddddddddddddddddddddddddddddddddddddddd999999999999999999999dd999999dd99999dd99999ddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        99999999999ddddddddddddddddddddddddddddddddddddddddddddd9999999999999999999ddd9999dddddd99ddd9999dddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        999999999999ddddddddddddddddddddddddddddddddddddddddddddd99999999999999999dddd99999dddd999dddd999dddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        999999999999dddddddddddddddddddddddddddddddddddddddddddddd999999999999999999ddd9999ddddd999dd999ddddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        99999999999ddddddddddddddddddddddddddddddddddddddddddddddd9999999999999999dddddd9dddddddd99ddd99ddddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        9999999999ddddddddddddddddddddddddddddddddddddddddddddddddd99999999999999dddddd9ddddddddddddd99dddddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        99999999dddddddddddddddddddddddddddddddddddddddddddddddddddd999999999999999dddddddddddddddddddddddddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        9999999dddddddddddddddddddddddddddddddddddddddddddddddddddddd9999999999999ddddddddddddddddddddddddddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        999999dddddddddddddddddddddddddddddddddddddddddddddddddddddddd99999999999dddddddddddddddddddddddddddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        99999dddddddddddddddddddddddddddddddddddddddddddddddddddddddddd9999999999999ddddddddddddddddddddddddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        999ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd99999999999dddddddddddddddddddddddddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        99ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd99999999dddddddddddddddddddddddddddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        9dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd99999ddddddddddddddddddddddddddddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd999dddddddddddddddddddddddddddddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd6dddddddddddddddddddd6ddddddddddddddddddddddddddddd
        ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd6666666666666666666666ddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddbbbbddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddbbbbddddddd
        dddddddbb5555bbddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddbb2222bbddddd
        ddddddb55555555bdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd22ddddd2dddddd2dddddddddddb22222222bdddd
        ddddddb55555555bdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd22dd22ddd2ddddd2ddddddddddddb22222222bdddd
        dddddb5555555555bdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd2dddddd2dd2dddd2ddddddddddddb2222222222bddd
        dddddb5555555555bdddeeeeddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd2dddddd2dd2ddd2dddddddddddddb2222222222bddd
        dddddbb55555555bbddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd2dddddddd2d2dd2ddddddddddddddbb22222222bbddd
        dddddbb55555555bbddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd2dddddddd2d2d2ddddddeeeedddddbb22222222bbddd
        dddddbebb5555bbebddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd2dddddddd2d22ddddddddddddddddbebb2222bbebddd
        dddddbeeebbbbeeebddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd2dddddddd2d22ddddddddddddddddbeeebbbbeeebddd
        dddddbeeeeeeeeeebdddeeeedddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd2dddddddd2d2d2dddddddddddddddbeeeeeeeeeebddd
        ddddddbeeeeeeeebdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd2dddddddd2d2dd2ddddddddddddddbeeeeeeeeeebddd
        ddddddbeeeeeeeebdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd2dddddddd2d2ddd2ddddeeeeddddddbeeeeeeeebdddd
        dddddddbbeeeebbdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd2dddddd2dd2dddd2dddddddddddddbeeeeeeeebdddd
        dddddddddbbbbdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd2dddddd2dd2ddddd2dddddddddddddbbeeeebbddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd22dd22ddd2dddddd2ddddddddddddddbbbbddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd22dddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        `)
    textSprite2 = textsprite.create("Choose", 0, 8)
    textSprite2.setMaxFontHeight(10)
    textSprite2.setPosition(46, 41)
    textSprite3 = textsprite.create("a class:", 0, 8)
    textSprite3.setMaxFontHeight(10)
    textSprite3.setPosition(58, 63)
    textSprite4 = textsprite.create("Game #" + gameNum, 0, 8)
    textSprite4.setPosition(75 - textSprite4.width / 2, 85)
    textSprite5 = textsprite.create("Change game #", 0, 8)
    textSprite5.setOutline(1, 5)
    textSprite5.setPosition(105 - textSprite5.width / 2, 98)
    loadClass()
}
function getItem (itemName: string) {
    if (itemName == "5HEARTS") {
        player_max_life += 5
        store_items.pop()
        store_items.push("10HEARTS")
    } else if (itemName == "10HEARTS") {
        player_max_life += 10
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.StoreItem, function (sprite, otherSprite) {
    if (sprites.readDataBoolean(otherSprite, "available")) {
        mySprite = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . 1 1 1 . . 
            . . . . . . . . . . 1 7 7 7 1 . 
            . . . . . . . . . 1 7 7 f 7 7 b 
            . . . . . . . . . 1 7 f 7 f 7 b 
            . . . . . . . . . 1 7 f f f 7 b 
            . . . . . . . . . 1 7 f 7 f 7 b 
            . . . . . . . . . . b 7 7 7 b . 
            . . . . . . . . . . . b b b . . 
            `, SpriteKind.HUD)
        mySprite.setPosition(otherSprite.x, otherSprite.y)
        mySprite.lifespan = 1000
    }
})
function fightMonster (enemy: Sprite) {
    currentScreen = SCR_BATTLE
    monster_tileRow = enemy.tilemapLocation().row
    monster_tileCol = enemy.tilemapLocation().column
    getMonster(enemy.image)
    game.showLongText("prepare to battle the " + monster_name, DialogLayout.Top)
    scene.centerCameraAt(0, 0)
    drawArena()
}
function loadClass () {
    if (playerSprite) {
        playerSprite.destroy()
    }
    player_class_name = available_classes[classChoiceIndex]
    if (player_class_name == "WARRIOR") {
        playerSprite = sprites.create(assets.image`Warrior`, SpriteKind.Player)
    } else if (player_class_name == "DEMOLITIONIST") {
        playerSprite = sprites.create(assets.image`Demolitionist`, SpriteKind.Player)
    } else {
        playerSprite = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 6 6 6 6 6 6 6 . . . . 
            . . . 6 6 6 . . . . 6 6 6 . . . 
            . . . 6 6 . . . . . . 6 6 . . . 
            . . . . . . . . . . . 6 6 . . . 
            . . . . . . . . . . 6 6 . . . . 
            . . . . . . . . 6 6 6 . . . . . 
            . . . . . . . 6 6 6 . . . . . . 
            . . . . . . . 6 6 . . . . . . . 
            . . . . . . . 6 6 . . . . . . . 
            . . . . . . . 6 6 . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 6 6 . . . . . . . 
            . . . . . . . 6 6 . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Player)
    }
    if (currentScreen == SCR_CHOOSECLASS) {
        playerSprite.setPosition(120, 60)
        if (textSprite) {
            textSprite.destroy()
        }
        textSprite = textsprite.create(player_class_name)
        textSprite.setOutline(1, 6)
        textSprite.setPosition(120, 75)
    }
}
function doBattle () {
    if (player_attack_name == "BIG BOMB" && player_bombs == 0) {
        game.showLongText("No bombs :(", DialogLayout.Bottom)
        player_damage = 0
    } else {
        player_damage = randint(player_min_damage, player_max_damage)
        if (player_attack_name == "BIG BOMB") {
            player_bombs += -1
        }
    }
    if (player_damage == 0) {
        music.pewPew.play()
        game.splash("You miss!")
    } else {
        player_damage = player_damage * player_dmg_mult + player_level
        music.knock.play()
        game.showLongText("You hit with " + player_attack_name + " for " + player_damage + " damage", DialogLayout.Bottom)
        monster_life += player_damage * -1
        if (monster_life < 0) {
            monster_life = 0
        }
        drawArena()
        if (0 >= monster_life) {
            music.bigCrash.play()
            game.splash("The monster dies!")
            levelMonsterCount += 0 - 1
            player_level_progress += 1
            if (player_level_progress == MON_PER_LVL) {
                player_level_progress = 0
                player_level += 1
                game.splash("Level up! XP bonus DMG +" + player_level)
                music.powerUp.play()
            }
            tileStatus[monster_tileRow * tilemapCols + monster_tileCol] = 1
            if (monster_image.equals(boss_monster_image)) {
                game.over(true, effects.starField)
            }
            getCoins(monster_reward)
            initMap()
            if (levelMonsterCount == 0) {
                player_dmg_mult = 2
                player_dmg_mult_next = 2
                game.splash("Level cleared: 2x DAMAGE!")
            }
        }
    }
    if (0 < monster_life) {
        monster_damage = randint(0, monster_dmg_max)
        if (monster_damage == 0) {
            music.pewPew.play()
            game.splash("" + monster_name + " misses!")
        } else {
            music.smallCrash.play()
            game.showLongText("" + monster_name + " hits you for " + monster_damage + " damage", DialogLayout.Bottom)
            if (info.life() - monster_damage <= 0) {
                info.setLife(1)
                game.splash("You died!")
                doGameOver()
            } else {
                info.changeLifeBy(monster_damage * -1)
            }
        }
    }
}
function fillStores () {
    for (let storeTile of tiles.getTilesByType(assets.tile`store0`)) {
        tiles.setTileAt(storeTile, sprites.castle.tilePath5)
        if (tileStatus[storeTile.row * tilemapCols + storeTile.col] == 0) {
            tiles.placeOnTile(getStoreItem(store_items[0]), storeTile)
        }
    }
    for (let storeTile2 of tiles.getTilesByType(assets.tile`store1`)) {
        tiles.setTileAt(storeTile2, sprites.castle.tilePath5)
        if (tileStatus[storeTile2.row * tilemapCols + storeTile2.col] == 0) {
            tiles.placeOnTile(getStoreItem(store_items[1]), storeTile2)
        }
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Exit, function (sprite, otherSprite) {
    music.jumpDown.playUntilDone()
    mapCells = []
    initMap()
})
function drawMenu () {
    clearSprites()
    tiles.setCurrentTilemap(tilemap`allblackTilemap`)
    textSprite = textsprite.create(menuTitle)
    textSprite.setOutline(1, 14)
    textSprite.setMaxFontHeight(10)
    textSprite.setPosition(scene.screenWidth() / 2, textSprite.height / 2 + 30)
    j = 0
    for (let menu_option of menuOptions) {
        textSprite2 = textsprite.create(menu_option)
        textSprite2.setPosition(40 + textSprite2.width / 2, 70 + j * 10)
        j += 1
    }
    textSprite3 = textsprite.create("->")
    textSprite3.setPosition(25, 70 + menuIdx * 10)
}
function myRandInt (low: number, high: number) {
    x = Math.sin(randomSeed) * 10000
    randomSeed = randomSeed + 1
    randDec = x - Math.floor(x)
    span = 1 + high - low
    return low + Math.floor(randDec * span)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (currentScreen == SCR_BATTLE) {
        return
    }
    player_x = playerSprite.x
    player_y = playerSprite.y
    fightMonster(otherSprite)
})
let span = 0
let randDec = 0
let x = 0
let j = 0
let monster_damage = 0
let player_damage = 0
let monster_tileCol = 0
let monster_tileRow = 0
let mySprite: Sprite = null
let newSprite: Sprite = null
let spriteKind2 = 0
let newImage: Image = null
let monsterLifeTextSprite: TextSprite = null
let attackTextSprite: TextSprite = null
let store_items: string[] = []
let itemName = ""
let weaponName = ""
let shopName = ""
let cost = 0
let player_level_progress = 0
let menuTitle = ""
let contLevel = 0
let tmpCurScreen = 0
let player_bombs = 0
let player_level = 0
let player_class_name = ""
let tempStr = ""
let dy = 0
let dx = 0
let mapgenDone = 0
let tilemapY = 0
let tilemapX = 0
let direction = 0
let dirsDone = 0
let levelNum = 0
let textSprite5: TextSprite = null
let textSprite4: TextSprite = null
let tmpSpriteX = 0
let textSprite3: TextSprite = null
let textSprite2: TextSprite = null
let tmpSpriteY = 0
let textSprite: TextSprite = null
let player_max_damage = 0
let player_min_damage = 0
let player_attack_name = ""
let monster_dmg_max = 0
let monster_life = 0
let monster_name = ""
let monster_image: Image = null
let monster_reward = 0
let tmpRandom = 0
let randomSeed = 0
let levelSeed = 0
let player_y = 0
let player_x = 0
let levelMonsterCount = 0
let player_max_life = 0
let playerSprite: Sprite = null
let player_items: string[] = []
let player_weapons: string[] = []
let player_weapon_index = 0
let SCR_CHOOSECLASS = 0
let tilemapRows = 0
let player_dmg_mult_next = 0
let player_dmg_mult = 0
let mapCells: Image[] = []
let tilemapCols = 0
let tileStatus: number[] = []
let storeItemSprite: Sprite = null
let menuOptions: string[] = []
let menuIdx = 0
let currentScreen = 0
let classChoiceIndex = 0
let gameNum = 0
let powerupList: Image[] = []
let boss_monster_image: Image = null
let monsterListLvl2: Image[] = []
let monsterList: Image[] = []
let available_classes: string[] = []
let MON_PER_LVL = 0
let SCR_MENU = 0
let SCR_BATTLE = 0
let SCR_MAP = 0
let betaBattlesVersion = ""
let tempCoin = null
let tmpMenuResult = ""
betaBattlesVersion = "v2.0.0b"
SCR_MAP = 1
SCR_BATTLE = 2
SCR_MENU = 3
MON_PER_LVL = 10
let tmpTileMapCell: Image
game.setDialogTextColor(5)
game.setDialogFrame(img`
    . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . 
    `)
showSplashScreen()
// textSprite5.setPosition(textSprite.width + 30, textSprite.height)
game.showLongText("Press A", DialogLayout.Bottom)
music.jumpDown.play()
game.setDialogTextColor(8)
game.setDialogFrame(img`
    . 6 . 6 . 6 6 . . 6 6 . 6 6 . 
    6 . 6 6 6 . . 6 6 . 6 6 6 . 6 
    . 6 6 1 1 6 6 1 6 1 1 6 . 6 . 
    6 . 6 1 1 1 1 1 1 1 1 1 6 6 . 
    . 6 1 1 1 1 1 1 1 1 1 1 1 6 6 
    . 6 1 1 1 1 1 1 1 1 1 1 6 . 6 
    6 6 6 1 1 1 1 1 1 1 1 1 1 6 . 
    6 . 1 1 1 1 1 1 1 1 1 1 1 6 . 
    . 6 1 1 1 1 1 1 1 1 1 1 6 . 6 
    6 . 6 1 1 1 1 1 1 1 1 1 6 6 . 
    . 6 1 1 1 1 1 1 1 1 1 1 1 6 . 
    . 6 1 1 1 1 1 1 1 1 1 1 6 6 . 
    . 6 6 1 6 1 1 6 6 1 1 6 . 6 6 
    6 . 6 6 . 6 6 6 . 6 . . 6 . 6 
    6 6 6 . 6 6 . . 6 6 6 6 6 6 . 
    `)
available_classes.push("WARRIOR")
available_classes.push("DEMOLITIONIST")
monsterList.push(img`
    . . . . . b b b . . . . . . . . 
    . . . . b 2 2 2 b b . . . . . . 
    . . . . b 2 2 2 2 2 b . . . . . 
    . . . b 2 1 2 2 2 2 2 b . . . . 
    . . . b 2 2 2 2 2 2 2 2 b . . . 
    . . b 2 2 2 2 2 2 1 1 2 b . . . 
    . . b 2 2 2 2 2 2 1 1 2 2 b . . 
    . b 2 2 1 1 2 2 2 2 2 2 2 b . . 
    . b 2 2 1 1 2 2 2 2 2 b b . . . 
    . b 2 2 2 2 2 2 b b b e . . . . 
    . . b b b b b b c c c e . . . . 
    . . . . e c c c c c c e . . . . 
    . . . . e c c c c c c b . . . . 
    . . . . e c c c c c c b . . . . 
    . . . . . b c c c c b . . . . . 
    . . . . . . b b b b . . . . . . 
    `)
monsterList.push(assets.image`purple monster`)
monsterList.push(assets.image`Reaper`)
monsterList.push(assets.image`the angry person`)
monsterListLvl2.push(assets.image`aKarenMonster`)
monsterListLvl2.push(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . f f f . . 
    . . . . . . . . . . f d f d f . 
    . . . . . . . . . . f d d d f . 
    . . . . . . . . . . . f f f . . 
    . . . . . . . . . . . . . f . . 
    . . . . . . . . . . . . f f f . 
    . . . . 3 3 3 3 . . . f . f . f 
    . . 3 3 f 3 3 f 3 . . . . f . . 
    . . 3 3 3 3 3 3 3 . . . . f . . 
    3 3 3 3 3 3 3 3 3 3 3 . f . f . 
    3 3 3 3 3 3 3 3 3 3 3 f . . . f 
    `)
monsterListLvl2.push(img`
    . 2 2 2 2 2 . . . . . 2 2 . . . 
    . 2 1 4 1 2 . . . . 2 1 3 2 . . 
    . 2 4 4 4 2 . . . 2 2 3 3 2 . . 
    . 2 2 2 2 2 . . . . 2 2 3 2 . . 
    . . 2 2 2 . . . . . . 2 2 2 . . 
    . 2 2 2 2 2 . . . . 2 2 2 2 2 . 
    . 2 . 2 . 2 . . . . 2 . 2 . 2 . 
    . . . 2 . . . . . . . . 2 . . . 
    . . . 2 . . . . . . . . 2 . . . 
    . . . 2 . . . . . . . . 2 . . . 
    . . . 2 2 . . . . . . . 2 2 . . 
    . . . 2 2 . . . . . . . 2 2 . . 
    . . 2 2 . 2 . . . . . 2 . . 2 . 
    . . 2 . . 2 . . . . . 2 . . 2 . 
    . 2 . . . 2 . . . . 2 . . . 2 . 
    . . . . . . . . . . . . . . . . 
    `)
monsterListLvl2.push(img`
    . 8 8 8 8 8 . . . . . 8 8 . . . 
    . 8 1 4 1 8 . . . . 8 1 3 8 . . 
    . 8 4 4 4 8 . . . 8 8 3 3 8 . . 
    . 8 8 8 8 8 . . . . 8 8 3 8 . . 
    . . 8 8 8 . . . . . . 8 8 8 . . 
    . 8 8 8 8 8 . . . . 8 8 8 8 8 . 
    . 8 . 8 . 8 . . . . 8 . 8 . 8 . 
    . . . 8 . . . . . . . . 8 . . . 
    . . . 8 . . . . . . . . 8 . . . 
    . . . 8 . . . . . . . . 8 . . . 
    . . . 8 8 . . . . . . . 8 8 . . 
    . . . 8 8 . . . . . . . 8 8 . . 
    . . 8 8 . 8 . . . . . 8 . . 8 . 
    . . 8 . . 8 . . . . . 8 . . 8 . 
    . 8 . . . 8 . . . . 8 . . . 8 . 
    . . . . . . . . . . . . . . . . 
    `)
boss_monster_image = assets.image`Evil Sorcerer`
powerupList.push(assets.image`coinImg`)
gameNum = randint(1, 999999)
classChoiceIndex = 0
chooseClass()
initGame()
