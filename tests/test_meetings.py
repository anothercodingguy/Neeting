from unittest.mock import patch

def test_create_meeting(client, user_token):
    headers = {"Authorization": f"Bearer {user_token}"}
    
    # We will mock the index_meeting_transcript so it doesn't fail trying to talk to OpenAI in tests without an API key
    with patch("app.ai.vector_db.index_meeting_transcript") as mock_index:
        response = client.post(
            "/meetings/",
            headers=headers,
            json={
                "title": "Quarterly Planning",
                "transcript": "John: Let's discuss Q4. \n\nJane: I think we need more sales.\nJohn: Agreed."
            }
        )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Quarterly Planning"
    assert data["transcript_length"] > 0
    assert data["speaker_count"] >= 1
    assert "id" in data

def test_get_meetings(client, user_token):
    headers = {"Authorization": f"Bearer {user_token}"}
    with patch("app.ai.vector_db.index_meeting_transcript"):
        client.post(
            "/meetings/",
            headers=headers,
            json={"title": "M1", "transcript": "T1"}
        )
        client.post(
            "/meetings/",
            headers=headers,
            json={"title": "M2", "transcript": "T2"}
        )
    
    response = client.get("/meetings/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2

def test_get_meeting_not_found(client, user_token):
    headers = {"Authorization": f"Bearer {user_token}"}
    response = client.get("/meetings/999", headers=headers)
    assert response.status_code == 404
