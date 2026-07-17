package utils

import (
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"time"

	"github.com/PuerkitoBio/goquery"
)

type ExtractedData struct {
	Title     string
	Author    string
	Date      string
	SourceURL string
	HTML      string
}

// isSafeURL checks for SSRF by verifying scheme and host
func isSafeURL(targetURL string) error {
	u, err := url.Parse(targetURL)
	if err != nil {
		return fmt.Errorf("invalid url format")
	}

	if u.Scheme != "http" && u.Scheme != "https" {
		return fmt.Errorf("unsupported scheme: %s", u.Scheme)
	}

	ips, err := net.LookupIP(u.Hostname())
	if err != nil {
		return fmt.Errorf("could not resolve hostname: %v", err)
	}

	for _, ip := range ips {
		if ip.IsLoopback() || ip.IsPrivate() || !ip.IsGlobalUnicast() {
			return fmt.Errorf("access to internal network is not allowed")
		}
	}
	return nil
}

func FetchAndCleanHTML(targetURL string) (*ExtractedData, error) {
	if err := isSafeURL(targetURL); err != nil {
		return nil, fmt.Errorf("unsafe url: %w", err)
	}

	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	req, err := http.NewRequest("GET", targetURL, nil)
	if err != nil {
		return nil, fmt.Errorf("invalid request: %w", err)
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch url: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("received status code %d", resp.StatusCode)
	}

	limitedReader := io.LimitReader(resp.Body, 5*1024*1024)

	doc, err := goquery.NewDocumentFromReader(limitedReader)
	if err != nil {
		return nil, fmt.Errorf("failed to parse html: %w", err)
	}

	// Remove unwanted tags
	doc.Find("script, style, nav, footer, header, aside, iframe, noscript, svg").Remove()

	// Extract metadata
	title := doc.Find("title").First().Text()

	author := ""
	if metaAuthor, exists := doc.Find("meta[name='author']").Attr("content"); exists {
		author = metaAuthor
	} else if metaDC, exists := doc.Find("meta[name='dc.creator']").Attr("content"); exists {
		author = metaDC
	}

	date := ""
	if metaDate, exists := doc.Find("meta[property='article:published_time']").Attr("content"); exists {
		date = metaDate
	} else if metaDate2, exists := doc.Find("meta[name='date']").Attr("content"); exists {
		date = metaDate2
	}

	var contentSelection *goquery.Selection
	if doc.Find("article").Length() > 0 {
		contentSelection = doc.Find("article").First()
	} else if doc.Find("main").Length() > 0 {
		contentSelection = doc.Find("main").First()
	} else {
		contentSelection = doc.Find("body")
	}

	cleanedHTML, err := contentSelection.Html()
	if err != nil {
		return nil, fmt.Errorf("failed to get cleaned html: %w", err)
	}

	return &ExtractedData{
		Title:     title,
		Author:    author,
		Date:      date,
		SourceURL: targetURL,
		HTML:      cleanedHTML,
	}, nil
}
