# Rubik's Cube Words
This little tool was created for the getDigital Easter Quiz 2021, question 27. Try it on https://dotrey.github.io/rubiks-words/

# How to use

## Create a Cube 
Use the grid-view of the cube in the top-left to assign letters to the individual faces of the cube.

Click on `create` to use the current values to create a new cube. Missing values will be filled with a `.`.

Use the `import` and `export` buttons to save and load the values as a string that can be easily shared.

## Rotate the Cube
The buttons `F`, `F'`, `B`, `B'`, `R`, `R'`, `L`, `L'`, `U`, `U'`, `D`, `D'`, `M`, `M'`, `E`, `E'`, `S` and `S'` can be used to rotate parts of the cube according to this move notation https://en.wikipedia.org/wiki/Rubik%27s_Cube#Move_notation.

## Multiple Moves
You can also use the input next to `execute` to insert a list of moves like `U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2` and then click `execute`, to execute these moves in the given order. Invalid letters are ignored.

If the checkbox `2-layer` is checked (default), lower case letters will be interpreted as 2-layer moves. A `f` will move the front side and layer between front and back and is thus equivalent to `F S`. If the checkbox is unchecked, all given letters will be automatically converted to upper case.

If the checkbox `de` is checked, the inserted moves will be translated from the German notation (https://de.wikipedia.org/wiki/Zauberw%C3%BCrfel#Buchstabennotation) to the English notation. This should be unchecked if you enter English notation since the `U` is ambiguous!

# Randomize the Cube
The button `start random` allows you to execute random moves on the cube until you click `stop random`. You can enter words separated by comma in the text area below these buttons. After each random move, the stringified representation (as the current cube would be exported) is checked for the occurence of any of the given words. If a word is found, the current cube and the word will be added to a list below the cube visualisations. If the word can be found in normal order, `->` is used. If the word is found in reversed order, `<-` is used.