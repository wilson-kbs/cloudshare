package utils

import (
	"encoding/json"
	"log"
	"net/http"
)

// JSON Object
type JSON map[string]interface{}

// NewJSONObject return new JSON Object
func NewJSONObject() *JSON {
	return &JSON{}
}

// Add param with key/value in JSON Object
func (s *JSON) Add(key string, value interface{}) *JSON {
	(*s)[key] = value
	return s
}

// Set param with key/value in JSON Object
func (s *JSON) Set(key string, value interface{}) *JSON {
	(*s)[key] = value
	return s
}

// ToString return a string representation from JSON Object
func (s *JSON) ToString() (string, error) {
	data, err := json.Marshal(s)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

// Render :
func Render(w http.ResponseWriter, code int) {
	w.WriteHeader(code)
	w.Header().Add("Content-Type", "application/json")
	render, err := NewJSONObject().Add(string(rune(code)), http.StatusText(code)).ToString()
	if err != nil {
		log.Printf("Error Json Marshall : %#v",err)
	}
	w.Write([]byte(render))
}