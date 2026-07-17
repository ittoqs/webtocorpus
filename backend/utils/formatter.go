package utils

import (
	"encoding/json"
	"fmt"
	"regexp"
	"strings"

	md "github.com/JohannesKaufmann/html-to-markdown"
	"github.com/PuerkitoBio/goquery"
)

func ToMarkdown(html string) (string, error) {
	conv := md.NewConverter("", true, nil)
	markdown, err := conv.ConvertString(html)
	if err != nil {
		return "", fmt.Errorf("failed to convert to markdown: %w", err)
	}
	return markdown, nil
}

func ToJSON(data *ExtractedData) (string, error) {
	textContent, err := ToPlainText(data.HTML)
	if err != nil {
		textContent = data.HTML
	}

	type ResultJSON struct {
		Title     string `json:"title"`
		Author    string `json:"author"`
		Date      string `json:"date"`
		Content   string `json:"content"`
		SourceURL string `json:"source_url"`
	}

	result := ResultJSON{
		Title:     data.Title,
		Author:    data.Author,
		Date:      data.Date,
		Content:   textContent,
		SourceURL: data.SourceURL,
	}

	jsonBytes, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		return "", fmt.Errorf("failed to marshal json: %w", err)
	}

	return string(jsonBytes), nil
}

var blockTagRegex = regexp.MustCompile(`(?i)</?(p|div|h1|h2|h3|h4|h5|h6|li|br|blockquote|table|tr)[^>]*>`)

func ToPlainText(html string) (string, error) {
	// Ganti block tags dengan spasi agar tidak menempel
	htmlWithSpaces := blockTagRegex.ReplaceAllString(html, " ")

	doc, err := goquery.NewDocumentFromReader(strings.NewReader("<body>" + htmlWithSpaces + "</body>"))
	if err != nil {
		return "", fmt.Errorf("failed to parse html for plain text: %w", err)
	}

	text := doc.Text()

	// Bersihkan whitespace berlebih
	spaceRegex := regexp.MustCompile(`\s+`)
	text = spaceRegex.ReplaceAllString(text, " ")
	text = strings.TrimSpace(text)

	return text, nil
}
