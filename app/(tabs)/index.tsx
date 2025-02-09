import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

export default function HomeScreen() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState<string | null>(null);
  const scale = useSharedValue(1);

  const handlePress = (index: number) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    checkWinner(newBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    scale.value = withSpring(1.5, {}, () => (scale.value = withSpring(1)));
  };

  const checkWinner = (board: string[]) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        return;
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setCurrentPlayer("X");
  };
  return (
    <View style={styles.container}>
    <Text style={styles.title}>Tic Tac Toe</Text>
    {winner && <Text style={styles.winnerText}>{winner} Wins!</Text>}
    <View style={styles.board}>
      {board.map((cell, index) => (
        <TouchableOpacity key={index} style={styles.cell} onPress={() => handlePress(index)}>
          <Animated.Text style={[styles.cellText, { transform: [{ scale }] }]}>
            {cell}
          </Animated.Text>
        </TouchableOpacity>
      ))}
    </View>
    <TouchableOpacity onPress={resetGame} style={styles.resetButton}>
      <Text style={styles.resetText}>Reset</Text>
    </TouchableOpacity>
  </View>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  winnerText: { fontSize: 20, color: "green", marginBottom: 10 },
  board: { width: 300, height: 300, flexWrap: "wrap", flexDirection: "row" },
  cell: { width: 100, height: 100, justifyContent: "center", alignItems: "center", borderWidth: 1 },
  cellText: { fontSize: 36, fontWeight: "bold" },
  resetButton: { marginTop: 20, padding: 10, backgroundColor: "#ff5733", borderRadius: 5 },
  resetText: { color: "#fff", fontSize: 18 }
});
