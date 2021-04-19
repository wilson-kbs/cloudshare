package cache

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/wilson-kbs/cloudshare/services/files/modules/util"
)

// Store is a struct which implements access to cached files
type Store struct {
	dir string // Directory path of cache store
}

const (
	fileInfoExtention = ".info"
)

// JSONFileInfo define fileinfo json in cache store
type JSONFileInfo struct {
	Size     int64 `json:"Size"`
	Metadata struct {
		Name         string `json:"filename"`
		Type         string `json:"filetype"`
		LastModified string `json:"lastmodified"`
	} `json:"MetaData"`
}

// NewStore returns Store with path
func NewStore(path string) *Store {
	return &Store{dir: path}
}

// PathStore return absolute path of cache store
func (s *Store) PathStore() string {
	return s.dir
}

// PathStore return absolute path of file
func (s *Store) PathFile(path string) string {
	return filepath.Join(s.dir, path)
}

// GetNameFileInfo return name of file info
func (s *Store) GetNameFileInfo(path string) string {
	return path + fileInfoExtention
}

// Open a file
func (s *Store) Open(path string) (*os.File, error) {
	return os.Open(s.PathFile(path))
}

// Delete a file
func (s *Store) Delete(path string) error {
	return os.Remove(s.PathFile(path))
}

// Stat returns the info of the file
func (s *Store) Stat(path string) (os.FileInfo, error) {
	return os.Stat(s.PathFile(path))
}

// IsExist file in store
func (s *Store) IsExist(path string) bool {
	if state, _ := util.IsExist(s.PathFile(path)); !state {
		return false
	}
	return true
}

func (s *Store) FileInfo(path string) (fileInfo *JSONFileInfo, err error) {
	filePath := s.PathFile(s.GetNameFileInfo(path))

	if state, _ := util.IsExist(filePath); !state {
		err = fmt.Errorf("Error: %s not found", filePath)
		return
	}

	src, err := ioutil.ReadFile(filePath)
	if err != nil {
		return
	}

	err = json.Unmarshal(src, &fileInfo)
	if err != nil {
		return
	}
	return
}
