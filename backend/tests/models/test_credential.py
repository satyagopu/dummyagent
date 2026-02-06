from app.models.credential import UserCredential

def test_credential_model():
    cred = UserCredential(provider="openai", api_key_encrypted="abc")
    assert cred.provider == "openai"
    assert repr(cred) == "<UserCredential provider=openai>"
