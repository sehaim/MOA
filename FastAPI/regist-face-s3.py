from fastapi import FastAPI, UploadFile, File, HTTPException
from embedding import get_face_embedding
import face_recognition
import numpy as np
import cv2
import io

app = FastAPI()

class ImageRequest(BaseModel):
    image_url: str

"""
# 얼굴 이미지 업로드를 통해 임베딩 값을 추출하고 등록하는 엔드포인트
# 백에서 S3에 저장된 이미지 URL 받아와서 다운 후 임베딩 값 추출
# opencv 라이브러리 활용
# 추출된 임베딩 값을 다시 백으로 전달
"""
@app.post("/fast/register_face/")
async def register_face(request: ImageRequest):

    image_url = request.image_url
    print(f"Fetching image from URL: {image_url}")

    # 이미지 URL에서 이미지 다운로드
    response = requests.get(image_url)
    if response.status_code != 200:
        print(f"Failed to fetch image URL: {image_url}")
        raise HTTPException(status_code=400, detail="Image not found")

    # 이미지 파일을 읽고 OpenCV 형식으로 변환
    np_img = np.frombuffer(response.content, np.uint8)
    image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    try:
        face_locations = face_recognition.face_locations(image)
        if not face_locations:
            raise ValueError("얼굴을 찾을 수 없습니다.")
        # 얼굴 인코딩(임베딩) 추출
        face_embedding = face_recognition.face_encodings(image, face_locations)[0]
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Spring으로 전송 준비 (임베딩 값을 바이트 형식으로 변환)
    face_embedding_bytes = np.array(face_embedding, dtype=np.float32).tobytes()

    # 바이너리 데이터 반환
    print("Returning face embedding as binary data.")
    return Response(content=face_embedding_bytes, media_type="application/octet-stream")


# 서버 실행
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)