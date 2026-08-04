package com.baobab.gala.dto;

import java.util.Map;

public class CategoryTally {
    private String title;
    private Map<String, Integer> counts;
    private int totalVotes;
    private String winner;
    private int winnerCount;

    public CategoryTally(String title, Map<String, Integer> counts, int totalVotes, String winner, int winnerCount) {
        this.title = title;
        this.counts = counts;
        this.totalVotes = totalVotes;
        this.winner = winner;
        this.winnerCount = winnerCount;
    }

    public String getTitle() { return title; }
    public Map<String, Integer> getCounts() { return counts; }
    public int getTotalVotes() { return totalVotes; }
    public String getWinner() { return winner; }
    public int getWinnerCount() { return winnerCount; }
}
