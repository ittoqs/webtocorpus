package backend

import (
	"encoding/json"
	"net/http"

	"web-to-corpus/backend/utils"
)

type ConvertRequest struct {
	URL    string `json:"url"`
	Format string `json:"format"` // "md", "json", "txt"
}

type ConvertResponse struct {
	Data      string `json:"data"`
	Title     string `json:"title,omitempty"`
	Author    string `json:"author,omitempty"`
	Date      string `json:"date,omitempty"`
	SourceURL string `json:"source_url,omitempty"`
	Error     string `json:"error,omitempty"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	// CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(ConvertResponse{Error: "Only POST method is allowed"})
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 1<<20)
	var req ConvertRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ConvertResponse{Error: "Invalid JSON request body or payload too large"})
		return
	}

	if req.URL == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ConvertResponse{Error: "URL is required"})
		return
	}

	format := req.Format
	if format == "" {
		format = "md"
	}

	extractedData, err := utils.FetchAndCleanHTML(req.URL)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ConvertResponse{Error: err.Error()})
		return
	}

	var result string
	switch format {
	case "md":
		result, err = utils.ToMarkdown(extractedData.HTML)
	case "json":
		result, err = utils.ToJSON(extractedData)
	case "txt":
		result, err = utils.ToPlainText(extractedData.HTML)
	default:
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ConvertResponse{Error: "Unsupported format. Use md, json, or txt"})
		return
	}

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ConvertResponse{Error: "Failed to format content: " + err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ConvertResponse{
		Data:      result,
		Title:     extractedData.Title,
		Author:    extractedData.Author,
		Date:      extractedData.Date,
		SourceURL: extractedData.SourceURL,
	})
}
