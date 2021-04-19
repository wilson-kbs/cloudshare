package cron

import (
	"github.com/robfig/cron"
)

var (
	c = cron.New()
)

func init() {
	c.Start()
}

func Add(time string, fn func()) {
	c.AddFunc(time, fn)
}
