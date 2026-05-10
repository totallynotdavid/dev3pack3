FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

ARG USERNAME=vscode
ARG ANCHOR_VERSION=0.32.1

# install system dependencies.
# includes deps for:
#   1. solana & anchor
#   2. bubblewrap
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libudev-dev \
    llvm \
    libclang-dev \
    protobuf-compiler \
    libssl-dev \
    bubblewrap \
    socat \
    curl \
    ca-certificates \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# add chrome apt repo
RUN curl -fsSL https://dl.google.com/linux/linux_signing_key.pub \
    | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" \
    > /etc/apt/sources.list.d/google-chrome.list

# install chrome
RUN apt-get update && apt-get install -y \
    google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

USER ${USERNAME}

# install bun
RUN curl -fsSL https://bun.sh/install | bash

# install rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \
    | sh -s -- -y

# Make user-installed tooling available during image build and at runtime.
ENV PATH="/home/${USERNAME}/.cargo/bin:/home/${USERNAME}/.bun/bin:/home/${USERNAME}/.local/share/solana/install/active_release/bin:/home/${USERNAME}/.avm/bin:${PATH}"

# install solana
RUN curl -sSfL https://release.anza.xyz/stable/install | sh

# Ensure platform-tools are properly initialized
RUN cd ~/.local/share/solana/install/active_release/bin/platform-tools-sdk/sbf && \
    bash scripts/install.sh

# install avm (anchor version manager)
RUN cargo install --git https://github.com/solana-foundation/anchor --tag v${ANCHOR_VERSION} avm

# install and activate anchor
RUN avm install ${ANCHOR_VERSION} && avm use ${ANCHOR_VERSION}
