package api

import (
	"net/http"
	"web-to-corpus/backend"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	backend.Handler(w, r)
}
