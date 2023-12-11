import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  private defaultOffset: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit');
    this.defaultOffset = this.configService.get<number>('defaultOffset');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const newPokemon = await this.pokemonModel.create(createPokemonDto);

      return newPokemon;
    } catch (error) {
      this.duplicatedDocumentException(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = this.defaultOffset } =
      paginationDto;

    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    // * Search Pokémon by number
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });

      if (!pokemon)
        throw new NotFoundException(`Pokemon with number ${term} not found`);

      return pokemon;
    }

    // * Search Pokémon by MongoID
    if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);

      if (!pokemon)
        throw new NotFoundException(`Pokemon with ID ${term} not found`);

      return pokemon;
    }

    // * Search Pokémon by name
    pokemon = await this.pokemonModel.findOne({
      name: term.toLocaleLowerCase().trim(),
    });

    if (!pokemon)
      throw new NotFoundException(`Pokemon with name ${term} not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto, {
        new: true,
      });

      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.duplicatedDocumentException(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0)
      throw new NotFoundException(`Pokemon with ID ${id} not found`);
  }

  private duplicatedDocumentException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException('Pokemon already exists');
    }

    console.log(error);

    throw new InternalServerErrorException('Error creating Pokemon');
  }
}
