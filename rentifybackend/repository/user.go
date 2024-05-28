package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/AshishKothariii/rentifybackend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// UserRepository handles the user persistence logic
type UserRepository interface {
    GetAllUsers(ctx context.Context) ([]*models.User, error)
    GetUserByID(ctx context.Context, id primitive.ObjectID) (*models.User, error)
    CreateUser(ctx context.Context, user *models.User) error
 GetUserByEmail(ctx context.Context, email string) (*models.User, error) }

type userRepository struct {
    collection *mongo.Collection
}

// NewUserRepository creates a new instance of UserRepository
func NewUserRepository(db *mongo.Database) UserRepository {
	fmt.Print("ruuning correctly")
    return &userRepository{collection: db.Collection("users")}
}

func (r *userRepository) GetAllUsers(ctx context.Context) ([]*models.User, error) {
    var users []*models.User
    cursor, err := r.collection.Find(ctx, bson.M{})
    if err != nil {
        return nil, err
    }
    for cursor.Next(ctx) {
        var user models.User
        if err := cursor.Decode(&user); err != nil {
            return nil, err
        }
        users = append(users, &user)
    }
    return users, nil
}

func (r *userRepository) GetUserByID(ctx context.Context, id primitive.ObjectID) (*models.User, error) {
    var user models.User
    if err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&user); err != nil {
        return nil, err
    }
    return &user, nil
}

func (r *userRepository) CreateUser(ctx context.Context, user *models.User) error {
    // Check if a user with the same email already exists
    existingUser := &models.User{}
    err := r.collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(existingUser)
    if err == nil {
        fmt.Print("User exists")
        return errors.New("user with this email already exists")
    } else if err != mongo.ErrNoDocuments {
        return err // Error other than not found
    }

    // If no existing user found with the same email, proceed with user creation
    user.Avatar = "https://github.com/AshishKothariii/gotalkapi/blob/main/public/Avatar.jpeg"
    _, err = r.collection.InsertOne(ctx, user)
    return err
}

func (r *userRepository) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
    var user models.User
    if err := r.collection.FindOne(ctx, bson.M{"email": email}).Decode(&user); err != nil {
        return nil, err
    }
    return &user, nil
}