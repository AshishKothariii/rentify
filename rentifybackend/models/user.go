package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	FirstName string             `bson:"firstname" json:"firstname"`
	LastName string              `bson:"lastname" json:"lastname"`
	Email    string             `bson:"email" json:"email"`
	MobileNo string         `bson:"mobileno" json:"mobileno"`
	Password string             `bson:"password" json:"password"`
	Avatar string `bson:"avatar" json:"avatar"`
}