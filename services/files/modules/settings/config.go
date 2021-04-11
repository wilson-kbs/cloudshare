package settings

import (
	"log"
	"os"
	"path"
	"path/filepath"
	"sync"

	"golang.org/x/sys/unix"
)

// Config App
type Config struct {
	storePath            string // store location from File System
	webAddress           string // IP address from listen Web handler
	webPort              string // Port from listen Web handler
	webBasePath          string // Base URL Web handler
	gRPCAdress           string // IP address from listen gRPC handler
	gRPCPort             string // Port from listen gRPC handler
	metadataMSgRPCAdress string // Address microservice to get Metadata Files
	metadataMSgRPCPort   string // Port microservice to get MetaFiles
}

var (
	conf      *Config
	once      sync.Once
	prefixEnv string = "CLOUDSHARE_"
)

// Getconf return Config options
func Getconf() *Config {
	once.Do(func() {
		storePath := os.Getenv(prefixEnv + "STORE_PATH")
		webAddress := "0.0.0.0"
		webPort := "3000"
		webBasePath := os.Getenv(prefixEnv + "WEB_BASEPATH")
		gRPCAdress := "0.0.0.0"
		gRPCPort := os.Getenv("GRPC_LISTEN_PORT")
		metadataMSgRPCAdress := os.Getenv(prefixEnv + "METADATA_MANAGER_ADDRESS")
		metadataMSgRPCPort := os.Getenv("GRPC_LISTEN_PORT")

		if storePath == "" {
			storePath = "/data"
		}

		if metadataMSgRPCAdress == "" {
			log.Fatalf("Error: Not found \"" + prefixEnv + "METADATA_MANAGER_ADDRESS\" Environment variable ")
		}

		if webBasePath == "" {
			webBasePath = "/"
		}

		if !path.IsAbs(webBasePath) {
			webBasePath = path.Join("/", webBasePath)
		}

		conf = &Config{
			storePath:            checkPathStore(storePath),
			webAddress:           webAddress,
			webPort:              webPort,
			webBasePath:          filepath.Join("/", webBasePath),
			gRPCAdress:           gRPCAdress,
			gRPCPort:             gRPCPort,
			metadataMSgRPCAdress: metadataMSgRPCAdress,
			metadataMSgRPCPort:   metadataMSgRPCPort,
		}
	})

	return conf
}

// GetStorePath return storePath option
func (s *Config) GetStorePath() string {
	return s.storePath
}

// GetWebBasePath return webBasePath option
func (s *Config) GetWebBasePath() string {
	return s.webBasePath
}

// GetWebAddress return webaddress option
func (s *Config) GetWebAddress() string {
	return s.webAddress
}

// GetWebPort return webPort option
func (s *Config) GetWebPort() string {
	return s.webPort
}

// GetgRPCAddress return webaddress option
func (s *Config) GetgRPCAddress() string {
	return s.gRPCAdress
}

// GetgRPCPort return webPort option
func (s *Config) GetgRPCPort() string {
	return s.gRPCPort
}

// GetMetadataMSgRPCAdress return address metadata microservice
func (s *Config) GetMetadataMSgRPCAdress() string {
	return s.metadataMSgRPCAdress
}

// GetMetadataMSgRPCPort return port dial to metadata microservice
func (s *Config) GetMetadataMSgRPCPort() string {
	return s.metadataMSgRPCPort
}

func checkPathStore(path string) string {
	absPath, err := filepath.Abs(path)
	log.Println(absPath)
	if err != nil {
		log.Fatalf("Error: %v", err)
	}

	stat, err := os.Stat(absPath)
	if err != nil {
		log.Fatalf("Error: %v directory not found", absPath)
	}

	if !stat.IsDir() {
		log.Fatalf("Error: %v is not directory", absPath)
	}

	if unix.Access(path, unix.W_OK) != nil {
		log.Fatalf("Error: %v directory not writable", absPath)
	}

	return absPath
}
