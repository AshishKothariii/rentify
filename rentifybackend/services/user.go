package services

import (
	"context"

	"github.com/AshishKothariii/rentifybackend/models"
	"github.com/AshishKothariii/rentifybackend/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

// UserService handles the business logic for user operations
type UserService interface {
    GetAllUsers(ctx context.Context) ([]*models.User, error)
    GetUserByID(ctx context.Context, id primitive.ObjectID) (*models.User, error)
    CreateUser(ctx context.Context, firstname string,lastname string, mobileno string,email string, password string) (*models.User, error)
     CheckUserCredentials(ctx context.Context, email string, password string) (*models.User, error)
    GetUserByEmail(ctx context.Context, email string) (*models.User, error)
}

type userService struct {
    repo repository.UserRepository
}

// NewUserService creates a new instance of UserService
func NewUserService(repo repository.UserRepository) UserService {
    return &userService{repo}
}

func (s *userService) GetAllUsers(ctx context.Context) ([]*models.User, error) {
    return s.repo.GetAllUsers(ctx)
}

func (s *userService) GetUserByID(ctx context.Context, id primitive.ObjectID) (*models.User, error) {
    return s.repo.GetUserByID(ctx, id)
}

func (s *userService) CreateUser(ctx context.Context, firstname string,lastname string, mobileno string,email string, password string) (*models.User, error) {
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        return nil, err
    }
    user := &models.User{
        FirstName: firstname,
        LastName: lastname,
        Email:    email,
        MobileNo: mobileno,
        Password: string(hashedPassword),
    }
    err = s.repo.CreateUser(ctx, user)
    return user, err
}

func (s *userService) CheckUserCredentials(ctx context.Context, email string, password string) (*models.User, error) {

    user, err := s.repo.GetUserByEmail(ctx, email)

    if err != nil {

        return nil, err
    }
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
        return nil, err
    }
    return user, nil
}
func (s *userService) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
    return s.repo.GetUserByEmail(ctx, email)
}