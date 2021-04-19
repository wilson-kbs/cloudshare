package storage

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/wilson-kbs/cloudshare/services/files/modules/setting"
	"github.com/wilson-kbs/cloudshare/services/files/modules/storage/cache"
	"github.com/wilson-kbs/cloudshare/services/files/modules/storage/files"
	"github.com/wilson-kbs/cloudshare/services/files/modules/util"
)

type LocalStorage struct {
	Files *files.Store
	Cache *cache.Store
}

// MetaDataFile defines the data of a file
type MetaDataFile struct {
	Name         string
	Type         string
	Size         int64
	LastModified int64
}

var (
	ObjectStorage = &LocalStorage{}
)

const (
	filesStoreName = "files"
	cacheStoreName = "cache"
)

func init() {
	ObjectStorage = NewLocalStore(setting.StoragePath)
}

func NewLocalStore(path string) *LocalStorage {
	filesStorePath := filepath.Join(path, filesStoreName)
	cacheStorePath := filepath.Join(path, cacheStoreName)

	for _, dir := range []string{filesStorePath, cacheStorePath} {
		// if not exist create the directory
		if isExist, _ := util.IsExist(dir); !isExist {
			_ = os.Mkdir(dir, 0664)
		}
		// if is not directory, print error and exit program
		if isDir, _ := util.IsDir(dir); !isDir {
			log.Fatalf("Error: %s this is not directory", dir)
		}
		// if this directory is not writable, print error and exit programm
		if !util.IsDirWritable(dir) {
			log.Fatalf("Error: %s this directory is not writable", dir)
		}
	}

	return &LocalStorage{
		Files: files.NewStore(filesStorePath),
		Cache: cache.NewStore(cacheStorePath),
	}

}

func (l *LocalStorage) CreateFileFromCache(cachefileID, newfileID string) (err error) {
	cacheFilePath := l.Cache.PathFile(cachefileID)
	if !l.Cache.IsExist(cachefileID) {
		err = fmt.Errorf("Error: %s this file is not exist", cacheFilePath)
		log.Printf("Error: %s", err.Error())
		return
	}
	newFilePath := l.Files.PathFile(newfileID)
	if err = os.Rename(cacheFilePath, newFilePath); err != nil {
		log.Printf("Error: %s", err.Error())
		return
	}
	return
}
