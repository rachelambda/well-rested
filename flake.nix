{
  description = "A typescript package for defining well-typed restful APIs";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (sys:
      let pkgs = import nixpkgs {
            system = sys;
          };
          node = pkgs.nodejs_20;
          deps = [ node ];
      in {
        devShells.default = pkgs.mkShell {
          shellHook = ''
            PATH="./node_modules/.bin:$PATH"
          '';
          packages = deps;
        };
      }
    );
}
