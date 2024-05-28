package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Listing struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Description   string        `bson:"description" json:"description"`
	City          string     		`bson:"city" json:"city"`
	Address       string        `bson:"address" json:"address"`
	RegularPrice  float64       `bson:"regular_price" json:"regular_price"`
	Bachelors     bool               `bson:"bachelors" json:"bachelors"`
	Bhk           int           `bson:"bhk" json:"bhk"`
	Furnished     bool          `bson:"furnished" json:"furnished"`
	Parking       bool          `bson:"parking" json:"parking"`
	ImageUrls     []string      `bson:"image_urls" json:"image_urls"`
	CreatedBy     string 		`bson:"createdby" json:"createdby"`
}