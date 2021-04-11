package storage

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strconv"

	"github.com/wilson-kbs/cloudshare/services/files_manager/modules/settings"

	"golang.org/x/sys/unix"
)

// Upload implement functions for manager upload files
type Upload struct {
	path string
}

// Cache implement function for manager cache files
type Cache struct {
	path string
}

const (
	uploadRelativePathStore = "upload"
	cacheRelativePathStore  = "cache"
)

var (
	uploadStore Upload
	cacheStore  Cache
)

func init() {
	path := ifIsNotExistMakeDirectory(uploadRelativePathStore)
	if !dirIsWritable(path) {
		log.Fatalf("Error: %v is not writable", path)
	}
	uploadStore = Upload{path}

	path = ifIsNotExistMakeDirectory(cacheRelativePathStore)
	if !dirIsWritable(path) {
		log.Fatalf("Error: %v directory not writable", path)
	}
	cacheStore = Cache{path}
}

// UploadStore return upload manager files
func UploadStore() *Upload {
	return &uploadStore
}

// CacheStore return cache manager files
func CacheStore() *Cache {
	return &cacheStore
}

// GetPath return path from uploadStore
func (s *Upload) GetPath() string {
	return s.path
}

// GetPath return path from cacheStore
func (s *Cache) GetPath() string {
	return s.path
}

// FileMoveFromCache move File from cache directory to upload Directory
func (s *Upload) FileMoveFromCache(oldID, newID string) error {
	oldPath := filepath.Join(cacheStore.path, oldID)
	newPath := filepath.Join(uploadStore.path, newID)
	if err := os.Rename(oldPath, newPath); err != nil {
		log.Panic(err)
	}
	return nil
}

// FileRead : Open File
func (s *Upload) FileRead(id string) (*os.File, error) {
	return os.Open(filepath.Join(s.path, id))

}

// FileReadFromBytes get a byte array of the file in the file Store
func (s *Upload) FileReadFromBytes(id string) ([]byte, error) {
	return ioutil.ReadFile(filepath.Join(s.path, id))

}

// FileGetStat get stat file in File Storepath
func (s *Upload) FileGetStat(id string) (os.FileInfo, error) {
	return os.Stat(filepath.Join(s.path, id))
}

// FileExist check if the file exists in File Store
func (s *Upload) FileExist(id string) bool {
	if _, err := os.Stat(filepath.Join(s.path, id)); err != nil {
		return false
	}
	return true
}

// RemoveFile remove file on uploadStore
func (s *Upload) RemoveFile(id string) error {
	return deleteFileFromStore("upload", id)
}

// File struct
type File struct {
	Name         string
	Type         string
	Size         int64
	LastModified int64
}

type filedata struct {
	Size     int64     `json:"Size"`
	Metadata *metadata `json:"MetaData"`
}

type metadata struct {
	Name         string `json:"filename"`
	Type         string `json:"filetype"`
	LastModified string `json:"lastmodified"`
}

// GetMetaFile return meta file info
func (s *Cache) GetMetaFile(id string) (*File, error) {
	data := filedata{}
	src, err := s.getReaderFileInfo(id)
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(src, &data)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	file := &File{}
	file.Name = data.Metadata.Name
	file.Type = data.Metadata.Type
	file.Size = data.Size
	lastmodified, err := strconv.ParseInt(data.Metadata.LastModified, 10, 64)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	file.LastModified = lastmodified

	return file, nil
}

// getReaderFileInfo return reader from file info
func (s *Cache) getReaderFileInfo(id string) ([]byte, error) {
	fileReader, err := ioutil.ReadFile(filepath.Join(s.path, id+".info"))
	if err != nil {
		log.Panic(err)
		return nil, err
	}
	return fileReader, nil
}

// FileExist : Get if file exist
func (s *Cache) FileExist(id string) bool {
	if _, err := os.Stat(filepath.Join(s.path, id)); err != nil {
		return false
	}
	if _, err := os.Stat(filepath.Join(s.path, id+".info")); err != nil {
		return false
	}
	return true
}

// RemoveFileInfo : Remove file info
func (s *Cache) RemoveFileInfo(id string) error {
	return deleteFileFromStore("cache", id+".info")
}

// RemoveFile : Remove file info
func (s *Cache) RemoveFile(id string) error {
	return deleteFileFromStore("cache", id)
}

func ifIsNotExistMakeDirectory(path string) string {
	dir := filepath.Join(settings.Getconf().GetStorePath(), path)
	if _, err := os.Stat(dir); err != nil {
		_ = os.Mkdir(dir, 0700)
	}
	if stat, _ := os.Stat(dir); !stat.IsDir() {
		log.Fatalf("Error: %v is not directory", dir)
	}
	return dir
}

func dirIsWritable(path string) bool {
	return unix.Access(path, unix.W_OK) == nil
}

// deleteFileFromStore : deletion according to store
func deleteFileFromStore(store, fileName string) error {
	var path string
	switch store {
	case "cache":
		path = filepath.Join(cacheStore.path, fileName)
	case "upload":
		path = filepath.Join(uploadStore.path, fileName)
	}
	if err := os.Remove(path); err != nil {
		return err
	}
	return nil
}
