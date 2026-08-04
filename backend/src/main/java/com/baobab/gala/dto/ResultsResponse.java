package com.baobab.gala.dto;

import java.util.Map;

public class ResultsResponse {
    private boolean resultsPublic;
    private long totalVoters;
    private Map<String, CategoryTally> tally;

    public ResultsResponse(boolean resultsPublic, long totalVoters, Map<String, CategoryTally> tally) {
        this.resultsPublic = resultsPublic;
        this.totalVoters = totalVoters;
        this.tally = tally;
    }

    public boolean isResultsPublic() { return resultsPublic; }
    public long getTotalVoters() { return totalVoters; }
    public Map<String, CategoryTally> getTally() { return tally; }
}
