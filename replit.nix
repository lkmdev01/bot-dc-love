{ pkgs }: {
    deps = with pkgs; [
        nodejs-18_x
        nodePackages.npm
        python3
        python3Packages.pip
        ffmpeg
        nodePackages.typescript-language-server
        yarn
        replitPackages.jest
    ];
    env = {
        LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
            pkgs.libuuid
        ];
    };
}
