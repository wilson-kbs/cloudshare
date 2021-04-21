package files

import (
	"log"
	"os"
	"path/filepath"

	"github.com/wilson-kbs/cloudshare/services/files/modules/util"
)

// Store is a struct which implements access to uploaded files
type Store struct {
	dir string // Directory path of cache store
}

// NewStore returns Store with path
func NewStore(path string) *Store {
	return &Store{dir: path}
}

// PathStore return absolute path of files store
func (s *Store) PathStore() string {
	return s.dir
}

// PathStore return absolute path of file
func (s *Store) PathFile(path string) string {
	return filepath.Join(s.dir, path)
}

// Open a file
func (s *Store) Open(path string) (*os.File, error) {
	return os.Open(filepath.Join(s.dir, path))
}

// Delete a file
func (s *Store) Delete(path string) error {
	p := filepath.Join(s.dir, path)
	return os.Remove(p)
}

// Stat returns the info of the file
func (s *Store) Stat(path string) (os.FileInfo, error) {
	return os.Stat(filepath.Join(s.dir, path))
}

// IsExist file in store
func (s *Store) IsExist(path string) bool {
	if state, err := util.IsExist(s.PathFile(path)); !state {
		log.Println(err)
		return false
	}
	return true
}
