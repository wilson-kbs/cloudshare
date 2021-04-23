package setting

import (
	"log"
	"os"
	"path"
	"path/filepath"
	"regexp"

	"golang.org/x/sys/unix"
)

var (
	// it's mounting point for this service
	AppURL string

	// it's web ui url
	WEBFrontURL string

	// Server settings
	HTTPAddr     string
	HTTPPort     string
	WEBBasePath  string
	LocalURL     string
	LoaclURI     string // http url with location path
	GRPCAddr     string
	GRPCPort     string
	GRPCLocalURL string

	// Client Settings
	GRPCMetaServiceURL string

	// Storage Settings
	StoragePath string
)

const (
	defaultStoradePath                  = "/data"
	defaultHTTPAndGRPCListenAddr        = "0.0.0.0"
	defaultHTTPListenPort               = "3000"
	defaultGRPCListenPort               = "9000"
	prefixEnv                    string = "CLOUDSHARE_"
)

func init() {
	NewContext()
}

func NewContext() {

	// STORAGE PATH
	StoragePath = os.Getenv(prefixEnv + "STORAGE_PATH")
	if StoragePath == "" {
		StoragePath = defaultStoradePath
	}
	IsOKStorage(StoragePath)

	// HTTP ADDR
	HTTPAddr = os.Getenv(prefixEnv + "HTTP_ADDR")
	if !IsOkAddr(HTTPAddr) {
		HTTPAddr = defaultHTTPAndGRPCListenAddr
	}

	// HTTP PORT
	HTTPPort = os.Getenv(prefixEnv + "HTTP_PORT")
	if !IsOkPort(HTTPPort) {
		HTTPPort = defaultHTTPListenPort
	}

	// LOCAL URL
	LocalURL = HTTPAddr + ":" + HTTPPort

	// HTTP ROOT URL
	WEBBasePath = os.Getenv(prefixEnv + "WEB_BASE_PATH")
	if !path.IsAbs(WEBBasePath) {
		WEBBasePath = path.Join("/", WEBBasePath)
	}

	// LOCAL URI
	LoaclURI = LocalURL + WEBBasePath

	// GRPC ADDR
	GRPCAddr = os.Getenv(prefixEnv + "GRPC_ADDR")
	if !IsOkAddr(GRPCAddr) {

		GRPCAddr = defaultHTTPAndGRPCListenAddr
	}

	// GRPC PORT
	GRPCPort = os.Getenv(prefixEnv + "GRPC_PORT")
	if !IsOkPort(GRPCPort) {
		GRPCPort = defaultGRPCListenPort
	}

	// GRPC Local URL
	GRPCLocalURL = GRPCAddr + ":" + GRPCPort

	// METADATA SERVICE URL
	GRPCMetaServiceURL = os.Getenv(prefixEnv + "GRPC_META_SERVICE_URL")
	if GRPCMetaServiceURL == "" {
		log.Fatalf("Error: Not found \"%sGRPC_META_SERVICE_URL\" Environment variable ", prefixEnv)
	}

	// METADATA SERVICE URL
	WEBFrontURL = os.Getenv(prefixEnv + "WEB_FRONT_URL")
	if WEBFrontURL == "" {
		log.Fatalf("Error: Not found \"%sWEB_FRONT_URL\" Environment variable ", prefixEnv)
	}

}

func IsOkAddr(addr string) bool {
	pattern := `^(([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.){3}([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$`
	if match, _ := regexp.Match(pattern, []byte(addr)); match {
		return true
	} else if addr == "localhost" {
		return true
	} else {
		return false
	}
}

func IsOkPort(port string) bool {
	pattern := `^([0-5]?[0-9]{0,3}[0-9]|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$`
	if match, _ := regexp.Match(pattern, []byte(port)); match {
		return true
	} else {
		return false
	}
}

func IsOKStorage(path string) {
	absPath, err := filepath.Abs(path)
	if err != nil {
		log.Fatalf("Error: %s", err)
	}

	stat, err := os.Stat(absPath)
	if err != nil {
		log.Fatalf("Error: %s directory not found", absPath)
	}

	if !stat.IsDir() {
		log.Fatalf("Error: %s is not directory", absPath)
	}

	if unix.Access(path, unix.W_OK) != nil {
		log.Fatalf("Error: %s directory not writable", absPath)
	}
}
