use clap::{App, Arg};

fn main() {
    let matches = App::new("Repo Manager")
        .version("1.0")
        .author("Your Name")
        .about("Manages repositories")
        .arg(
            Arg::with_name("greet")
                .long("greet")
                .value_name("NAME")
                .help("Greets the specified name")
                .takes_value(true),
        )
        .get_matches();

    if let Some(name) = matches.value_of("greet") {
        println!("Hello {}!", name);
    } else {
        println!("Use -h or --help for usage information.");
    }
}
