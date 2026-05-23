from pydantic_settings import BaseSettings

class Settings(BaseSettings):

    APP_NAME: str = "J.A.R.V.I.S"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()