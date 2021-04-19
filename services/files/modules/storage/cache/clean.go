package cache

import (
	"io/ioutil"
	"log"
	"time"
)

// Clean delete existing files if alive time is passed
func (s *Store) Clean() {
	log.Println("Start Clean Cache")
	files, err := ioutil.ReadDir(s.dir)
	if err != nil {
		log.Println(err)
	}

	for _, file := range files {
		d := file.ModTime().Add(s.aliveTime)
		if time.Now().After(d) {
			s.Delete(file.Name())
			log.Println("Remove: ", file.Name())
		}
	}
}
