Usage: learn [options] [command]

Options:
  -V, --version                    output the version number
  -i, --info                       a learn cli
  -s, --src <src>                  a source folder
  -d, --dest <dest>                a destination folder, 如: -d src/pages
  -f, --framework <framework>      your framework name
  -h, --help                       display help for command

Commands:
  create <project> [otherArgs...]  clone a repository into a newly created directory
  addcpn <name>                    add vue component, 例如: learn addcpn NarBar [-d src/components]
  addpage <page>                   add vue page, 例如: learn addpage Home [-d src/pages]
  addstore <store>                 add vue store, 例如: learn addstore favor [-d dest]
  help [command]                   display help for command

Others: