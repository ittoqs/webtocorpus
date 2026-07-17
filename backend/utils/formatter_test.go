package utils

import (
	"strings"
	"testing"
)

func TestToPlainText(t *testing.T) {
	html := "<h1>Hello World</h1><p>This is a test.</p>"
	expected := "Hello World This is a test."

	result, err := ToPlainText(html)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if result != expected {
		t.Errorf("Expected %q, got %q", expected, result)
	}
}

func TestToMarkdown(t *testing.T) {
	html := "<h1>Hello World</h1><p>This is a test.</p>"

	result, err := ToMarkdown(html)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if !strings.Contains(result, "# Hello World") {
		t.Errorf("Expected markdown to contain '# Hello World', got %q", result)
	}
	if !strings.Contains(result, "This is a test.") {
		t.Errorf("Expected markdown to contain 'This is a test.', got %q", result)
	}
}
