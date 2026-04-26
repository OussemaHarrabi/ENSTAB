"""TOTP 2FA helpers."""
import base64
from io import BytesIO

import pyotp
import qrcode


def generate_secret() -> str:
    return pyotp.random_base32()


def verify_code(secret: str, code: str) -> bool:
    return pyotp.TOTP(secret).verify(code, valid_window=1)


def get_qr_uri(email: str, secret: str, issuer: str = "UCAR Intelligence") -> str:
    return pyotp.TOTP(secret).provisioning_uri(name=email, issuer_name=issuer)


def get_qr_png_b64(email: str, secret: str) -> str:
    uri = get_qr_uri(email, secret)
    img = qrcode.make(uri)
    buf = BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("ascii")
