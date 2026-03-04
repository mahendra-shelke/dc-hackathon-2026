FROM python:3.11-slim AS liboqs-builder

# Force HTTPS to avoid Zscaler proxy redirect blocks
RUN sed -i 's/http:/https:/g' /etc/apt/sources.list.d/debian.sources \
    && apt-get update && apt-get install -y --no-install-recommends \
    cmake gcc g++ make git libssl-dev ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN git clone --depth 1 https://github.com/open-quantum-safe/liboqs.git /tmp/liboqs \
    && cd /tmp/liboqs && mkdir build && cd build \
    && cmake -DCMAKE_INSTALL_PREFIX=/usr/local \
             -DBUILD_SHARED_LIBS=ON \
             -DOQS_BUILD_ONLY_LIB=ON \
             .. \
    && make -j$(nproc) \
    && make install

FROM python:3.11-slim

# Copy liboqs shared libraries
COPY --from=liboqs-builder /usr/local/lib/liboqs* /usr/local/lib/
COPY --from=liboqs-builder /usr/local/include/oqs /usr/local/include/oqs
RUN ldconfig

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

CMD ["python", "-u", "pqc_device.py"]
