import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.database import Base, get_db, create_tables

def test_database_connection():
    """Test database connection and session creation"""
    # Create a test database in memory
    SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
    
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Test session creation
    db = TestingSessionLocal()
    assert db is not None
    db.close()

def test_get_db_generator():
    """Test the get_db dependency function"""
    db_generator = get_db()
    db = next(db_generator)
    assert db is not None
    
    # Close the generator
    try:
        next(db_generator)
    except StopIteration:
        pass  # Expected behavior

def test_create_tables():
    """Test the create_tables function"""
    # This function should execute without errors
    # It creates all tables defined in Base.metadata
    try:
        create_tables()
        # If we get here, the function executed successfully
        assert True
    except Exception as e:
        pytest.fail(f"create_tables() raised an exception: {e}")
